export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  // Parse body manually in case auto-parsing is disabled
  let pin
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    pin = body?.pin
  } catch {
    return res.status(400).json({ ok: false })
  }

  const adminPin = process.env.ADMIN_PIN
  if (!adminPin) {
    // Env var not configured — refuse login
    return res.status(503).json({ ok: false, error: 'ADMIN_PIN not configured' })
  }

  if (!pin || pin !== adminPin) {
    return res.status(401).json({ ok: false })
  }

  return res.status(200).json({ ok: true })
}
