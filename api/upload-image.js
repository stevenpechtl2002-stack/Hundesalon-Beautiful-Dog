import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const { base64, password, ext } = body

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  if (!base64 || !ext) {
    return res.status(400).json({ error: 'Missing base64 or ext' })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const buffer = Buffer.from(base64, 'base64')

  const { error } = await supabase.storage
    .from('property-images')
    .upload(fileName, buffer, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      upsert: false,
    })

  if (error) return res.status(500).json({ error: error.message })

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName)

  return res.status(200).json({ url: data.publicUrl })
}
