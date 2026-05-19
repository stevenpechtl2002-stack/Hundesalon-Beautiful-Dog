export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { content, password } = req.body
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const token = process.env.GITHUB_TOKEN
  const owner = 'stevenpechtl2002-stack'
  const repo = 'Hundesalon-Beautiful-Dog'
  const path = 'public/content.json'

  // Get current file SHA
  const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'beautiful-dog-cms' }
  })
  const fileData = await fileRes.json()
  const sha = fileData.sha

  // Separate base64 images from content to save as files
  const contentToSave = JSON.parse(JSON.stringify(content))
  const imageUpdates = []

  async function extractImages(obj, pathPrefix) {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string' && obj[key].startsWith('data:image/')) {
        const ext = obj[key].split(';')[0].split('/')[1]
        const fileName = `public/images/${pathPrefix}-${key}.${ext}`
        const base64Data = obj[key].split(',')[1]
        imageUpdates.push({ fileName, base64Data })
        obj[key] = `/images/${pathPrefix}-${key}.${ext}`
      } else if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        await extractImages(obj[key], `${pathPrefix}-${key}`)
      }
    }
  }

  await extractImages(contentToSave, 'img')

  // Upload images to GitHub
  for (const { fileName, base64Data } of imageUpdates) {
    const imgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'beautiful-dog-cms' }
    })
    const imgData = imgRes.ok ? await imgRes.json() : {}

    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fileName}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'beautiful-dog-cms' },
      body: JSON.stringify({
        message: `Admin: Bild aktualisiert (${fileName})`,
        content: base64Data,
        ...(imgData.sha ? { sha: imgData.sha } : {}),
      })
    })
  }

  // Save content.json
  const newContent = Buffer.from(JSON.stringify(contentToSave, null, 2)).toString('base64')
  const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'beautiful-dog-cms' },
    body: JSON.stringify({
      message: 'Admin: Inhalte aktualisiert',
      content: newContent,
      sha,
    })
  })

  if (updateRes.ok) return res.status(200).json({ ok: true })
  return res.status(500).json({ error: 'GitHub update failed' })
}
