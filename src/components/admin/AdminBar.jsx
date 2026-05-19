import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

export default function AdminBar() {
  const { isAdmin, login, logout, saveContent, saving, saveMsg } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    if (login(pw)) { setShowLogin(false); setPw(''); setError('') }
    else setError('Falsches Passwort')
  }

  if (isAdmin) return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: '#1e1a16',
      padding: '10px 24px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', boxShadow: '0 2px 20px rgba(255,181,216,0.4)',
      fontFamily: 'sans-serif'
    }}>
      <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
        ✏️ Admin-Modus — Texte und Bilder anklicken zum Bearbeiten
      </span>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {saveMsg && <span style={{ color: 'white', fontSize: 13 }}>{saveMsg}</span>}
        <button onClick={saveContent} disabled={saving} style={{
          background: 'white', color: '#1e1a16', border: 'none', borderRadius: 10,
          padding: '8px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer'
        }}>
          {saving ? 'Speichert...' : '💾 Speichern'}
        </button>
        <button onClick={logout} style={{
          background: 'rgba(255,255,255,0.25)', color: 'white', border: 'none',
          borderRadius: 10, padding: '8px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer'
        }}>Abmelden</button>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setShowLogin(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: '#1e1a16',
          color: 'white', border: 'none', borderRadius: 50,
          width: 52, height: 52, fontSize: 20, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
        }}
        title="Admin Login"
      >🐾</button>

      {showLogin && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowLogin(false)}>
          <form onSubmit={handleLogin} onClick={e => e.stopPropagation()} style={{
            background: 'white', borderRadius: 24, padding: 40, width: 320,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)', fontFamily: 'sans-serif'
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🐾</div>
              <h2 style={{ margin: 0, color: '#1a1025', fontSize: 20, fontWeight: 700 }}>Admin Login</h2>
              <p style={{ color: '#7a6e65', fontSize: 13, marginTop: 4 }}>Hundesalon Beautiful Dog</p>
            </div>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Passwort"
              autoFocus
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 12, fontSize: 15,
                border: '2px solid #ece8f5', outline: 'none', boxSizing: 'border-box',
                marginBottom: 8
              }}
            />
            {error && <p style={{ color: '#1e1a16', fontSize: 13, margin: '4px 0 8px' }}>{error}</p>}
            <button type="submit" style={{
              width: '100%', padding: '12px', borderRadius: 12, fontSize: 15,
              fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: 8,
              background: '#1e1a16', color: 'white'
            }}>Einloggen</button>
          </form>
        </div>
      )}
    </>
  )
}
