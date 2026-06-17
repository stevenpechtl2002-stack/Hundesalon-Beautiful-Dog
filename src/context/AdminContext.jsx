import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [content, setContent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    fetch(`/content.json?v=${Date.now()}`)
      .then(r => r.json())
      .then(setContent)
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
      if (res.ok) {
        setIsAdmin(true)
        return true
      }
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

  function addProperty(prop) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const maxId = (next.properties || []).reduce((m, p) => Math.max(m, p.id), 0)
      next.properties = [...(next.properties || []), { ...prop, id: maxId + 1 }]
      return next
    })
  }

  function updateProperty(id, prop) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.properties = next.properties.map(p => p.id === id ? { ...p, ...prop } : p)
      return next
    })
  }

  function deleteProperty(id) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.properties = next.properties.filter(p => p.id !== id)
      // Auto-save immediately after deletion
      setTimeout(() => saveContentWith(next), 50)
      return next
    })
  }

  async function saveContentWith(overrideContent) {
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: overrideContent, password: import.meta.env.VITE_ADMIN_PASSWORD }),
      })
      setSaveMsg(res.ok ? '✅ Gespeichert!' : '❌ Fehler beim Speichern.')
    } catch {
      setSaveMsg('❌ Netzwerkfehler.')
    }
    setSaving(false)
    setTimeout(() => setSaveMsg(''), 4000)
  }

  function updateService(index, field, value) {
    setContent(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.services[index][field] = value
      return next
    })
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

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, content, updateField, updateService, addProperty, updateProperty, deleteProperty, saveContent, saving, saveMsg }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() { return useContext(AdminContext) }
