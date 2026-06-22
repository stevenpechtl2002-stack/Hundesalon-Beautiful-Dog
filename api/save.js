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

  const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'nordzypern-immo-cms' }
  })
  const fileData = await fileRes.json()
  const sha = fileData.sha

  // Properties live in Supabase now — strip them before saving to content.json
  const contentToSave = { ...content }
  delete contentToSave.properties

  const newContent = Buffer.from(JSON.stringify(contentToSave, null, 2)).toString('base64')
  const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'nordzypern-immo-cms' },
    body: JSON.stringify({
      message: 'Admin: Inhalte aktualisiert',
      content: newContent,
      sha,
    })
  })

  if (updateRes.ok) return res.status(200).json({ ok: true })
  return res.status(500).json({ error: 'GitHub update failed' })
}
