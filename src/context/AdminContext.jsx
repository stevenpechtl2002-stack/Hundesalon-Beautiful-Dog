import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [content, setContent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    fetch('/content.json')
      .then(r => r.json())
      .then(setContent)
  }, [])

  function login(password) {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAdmin(true)
      return true
    }
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
    <AdminContext.Provider value={{ isAdmin, login, logout, content, updateField, updateService, saveContent, saving, saveMsg }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() { return useContext(AdminContext) }
