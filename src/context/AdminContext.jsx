import { createClient } from '@supabase/supabase-js'
import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function fromRow(row) {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    region: row.region,
    price: row.price,
    rooms: row.rooms,
    baths: row.baths,
    sqm: row.sqm,
    year: row.year,
    floor: row.floor,
    parking: row.parking,
    deal: row.deal,
    type: row.type,
    tags: row.tags || [],
    features: row.features || [],
    description: row.description || '',
    images: row.images || [],
    inMarquee: row.in_marquee,
    created_at: row.created_at,
  }
}

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [content, setContent] = useState(null)
  const [properties, setProperties] = useState([])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    fetch(`/content.json?v=${Date.now()}`)
      .then(r => r.json())
      .then(setContent)
  }, [])

  useEffect(() => {
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProperties(data.map(fromRow))
      })
  }, [])

  useEffect(() => {
    if (!content?.colors) return
    const r = document.documentElement
    r.style.setProperty('--site-btn', content.colors.primary || '#1e1a16')
    r.style.setProperty('--site-badge-bg', content.colors.accent || '#f0ede8')
    r.style.setProperty('--site-card-bg', content.colors.accent || '#f5f3f0')
    r.style.setProperty('--site-bg', content.colors.bg || '#FAFAFA')
  }, [content?.colors])

  async function login(pin) {
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (res.ok) { setIsAdmin(true); return true }
    } catch {}
    return false
  }

  function logout() { setIsAdmin(false) }

  function updateField(path, value) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  function updateService(index, field, value) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.services[index][field] = value
      return next
    })
  }

  async function addProperty(prop) {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prop, password: import.meta.env.VITE_ADMIN_PASSWORD }),
      })
      if (res.ok) {
        const created = await res.json()
        setProperties(prev => [fromRow(created), ...prev])
        setSaveMsg('✅ Inserat gespeichert!')
      } else {
        setSaveMsg('❌ Fehler beim Speichern.')
      }
    } catch {
      setSaveMsg('❌ Netzwerkfehler.')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 4000)
  }

  async function updateProperty(id, prop) {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prop, id, password: import.meta.env.VITE_ADMIN_PASSWORD }),
      })
      if (res.ok) {
        const updated = await res.json()
        setProperties(prev => prev.map(p => p.id === id ? fromRow(updated) : p))
        setSaveMsg('✅ Inserat aktualisiert!')
      } else {
        setSaveMsg('❌ Fehler beim Aktualisieren.')
      }
    } catch {
      setSaveMsg('❌ Netzwerkfehler.')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 4000)
  }

  async function deleteProperty(id) {
    try {
      const res = await fetch('/api/properties', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: import.meta.env.VITE_ADMIN_PASSWORD }),
      })
      if (res.ok) setProperties(prev => prev.filter(p => p.id !== id))
    } catch {}
  }

  async function saveContent() {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, password: import.meta.env.VITE_ADMIN_PASSWORD }),
      })
      if (res.ok) {
        setSaveMsg('✅ Gespeichert! Website wird in ~30 Sek. aktualisiert.')
      } else {
        setSaveMsg('❌ Fehler beim Speichern.')
      }
    } catch {
      setSaveMsg('❌ Netzwerkfehler.')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 5000)
  }

  const fullContent = content ? { ...content, properties } : null

  return (
    <AdminContext.Provider value={{
      isAdmin, login, logout,
      content: fullContent,
      updateField, updateService,
      addProperty, updateProperty, deleteProperty,
      saveContent, saving, saveMsg,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() { return useContext(AdminContext) }
