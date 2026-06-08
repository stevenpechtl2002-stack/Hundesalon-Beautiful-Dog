export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { pin } = req.body
  if (!pin || pin !== process.env.ADMIN_PIN) {
    return res.status(401).json({ ok: false })
  }

  // Simple session token: HMAC-like value never exposed to client source
  const secret = process.env.ADMIN_SECRET || 'fallback-secret'
  const token = Buffer.from(`${secret}:${Date.now()}`).toString('base64url')

  return res.status(200).json({ ok: true, token })
}
