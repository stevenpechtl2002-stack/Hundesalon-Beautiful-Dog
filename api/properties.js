import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

function checkPin(body) {
  return body?.password === process.env.ADMIN_PASSWORD
}

function toRow(prop) {
  return {
    title: prop.title,
    location: prop.location,
    region: prop.region,
    price: prop.price,
    rooms: prop.rooms,
    baths: prop.baths,
    sqm: prop.sqm,
    year: prop.year,
    floor: prop.floor ?? null,
    parking: prop.parking ?? false,
    deal: prop.deal,
    type: prop.type,
    tags: prop.tags || [],
    features: prop.features || [],
    description: prop.description || '',
    images: prop.images || [],
    in_marquee: prop.inMarquee ?? false,
  }
}

export default async function handler(req, res) {
  const supabase = getServiceClient()

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  if (!checkPin(body)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const { password, ...prop } = body
    const { data, error } = await supabase
      .from('properties')
      .insert([toRow(prop)])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PUT') {
    const { password, id, ...prop } = body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { data, error } = await supabase
      .from('properties')
      .update(toRow(prop))
      .eq('id', id)
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = body
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).end()
}
