import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'

const COLOR_PRESETS = [
  { label: 'Schwarz',    primary: '#1e1a16', accent: '#f0ede8', bg: '#FAFAFA' },
  { label: 'Rosa',       primary: '#c0607a', accent: '#fff0f4', bg: '#FAFAFA' },
  { label: 'Grün',      primary: '#2d6a4f', accent: '#eaf4ef', bg: '#FAFAFA' },
  { label: 'Blau',      primary: '#1a4a8a', accent: '#eef3fb', bg: '#FAFAFA' },
  { label: 'Lila',      primary: '#6b4fa0', accent: '#f3f0fb', bg: '#FAFAFA' },
  { label: 'Terrakotta',primary: '#8b4a2a', accent: '#fdf0ea', bg: '#FAFAFA' },
]

function ColorPanel({ onClose }) {
  const { content, updateField } = useAdmin()
  const colors = content?.colors || { primary: '#1e1a16', accent: '#f0ede8', bg: '#FAFAFA' }

  function set(key, val) { updateField(`colors.${key}`, val) }
  function applyPreset(p) {
    updateField('colors.primary', p.primary)
    updateField('colors.accent', p.accent)
    updateField('colors.bg', p.bg)
  }

  return (
    <div style={{
      position: 'fixed', top: 52, right: 16, zIndex: 9998,
      background: 'white', borderRadius: 20, padding: 24, width: 280,
      boxShadow: '0 20px 60px rgba(0,0,0,0.18)', fontFamily: 'sans-serif',
      border: '1px solid #eeebe6'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e1a16' }}>🎨 Farben anpassen</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>✕</button>
      </div>

      {[
        { key: 'primary', label: 'Button-Farbe',       hint: 'Buttons & Akzente' },
        { key: 'accent',  label: 'Highlight-Farbe',    hint: 'Badges & Karten' },
        { key: 'bg',      label: 'Seiten-Hintergrund', hint: 'Abschnittshintergrund' },
      ].map(({ key, label, hint }) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#333' }}>{label}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#999' }}>{hint}</p>
            </div>
            <label style={{ position: 'relative', cursor: 'pointer' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, border: '2px solid #e8e2db', background: colors[key], cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
              <input type="color" value={colors[key]} onChange={e => set(key, e.target.value)}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            </label>
          </div>
        </div>
      ))}

      <div style={{ borderTop: '1px solid #eeebe6', paddingTop: 16, marginTop: 4 }}>
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Schnell-Auswahl</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {COLOR_PRESETS.map(p => (
            <button key={p.label} onClick={() => applyPreset(p)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
              borderRadius: 8, border: '1px solid #e8e2db', background: 'white',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#333'
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: p.primary, flexShrink: 0 }} />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p style={{ margin: '14px 0 0', fontSize: 11, color: '#bbb', textAlign: 'center' }}>
        💾 Farben werden mit "Speichern" gesichert
      </p>
    </div>
  )
}

export default function AdminBar() {
  const { isAdmin, login, logout, saveContent, saving, saveMsg } = useAdmin()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const inputRefs = [null, null, null, null]
  const refs = [
    el => (inputRefs[0] = el),
    el => (inputRefs[1] = el),
    el => (inputRefs[2] = el),
    el => (inputRefs[3] = el),
  ]

  function handleDigit(i, val) {
    const v = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[i] = v
    setDigits(next)
    setError(false)
    if (v && i < 3) inputRefs[i + 1]?.focus()
    if (next.every(d => d !== '') && next.join('').length === 4) {
      const pin = next.join('')
      if (!login(pin)) {
        setError(true)
        setDigits(['', '', '', ''])
        setTimeout(() => inputRefs[0]?.focus(), 50)
      } else {
        setShowLogin(false)
        setDigits(['', '', '', ''])
        setError(false)
      }
    }
  }

  function handleKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs[i - 1]?.focus()
      const next = [...digits]
      next[i - 1] = ''
      setDigits(next)
    }
  }

  function openLogin() {
    setDigits(['', '', '', ''])
    setError(false)
    setShowLogin(true)
    setTimeout(() => inputRefs[0]?.focus(), 80)
  }

  if (isAdmin) return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
        background: 'var(--site-btn, #1e1a16)',
        padding: '10px 24px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        fontFamily: 'sans-serif'
      }}>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>
          ✏️ Admin-Modus — Texte und Bilder anklicken zum Bearbeiten
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✅') ? '#86efac' : '#fca5a5', fontWeight: 700 }}>{saveMsg}</span>}

          <button
            onClick={() => { navigate('/admin/inserate'); setShowColors(false) }}
            style={{
              background: 'rgba(255,255,255,0.15)', color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 10, padding: '7px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer'
            }}
          >🏠 Inserate</button>

          <button onClick={() => setShowColors(v => !v)} style={{
            background: 'rgba(255,255,255,0.15)', color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: 10, padding: '7px 14px', fontWeight: 600, fontSize: 13, cursor: 'pointer'
          }}>🎨 Farben</button>

          <button onClick={saveContent} disabled={saving} style={{
            background: 'white', color: 'var(--site-btn, #1e1a16)', border: 'none',
            borderRadius: 10, padding: '8px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer'
          }}>
            {saving ? 'Speichert...' : '💾 Speichern'}
          </button>

          <button onClick={logout} style={{
            background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none',
            borderRadius: 10, padding: '8px 16px', fontWeight: 600, fontSize: 13, cursor: 'pointer'
          }}>Abmelden</button>
        </div>
      </div>
      {showColors && <ColorPanel onClose={() => setShowColors(false)} />}
    </>
  )

  return (
    <>
      <button
        onClick={openLogin}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: 'var(--site-btn, #1e1a16)',
          color: 'white', border: 'none', borderRadius: 50,
          width: 52, height: 52, fontSize: 20, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
        }}
        title="Admin Login"
      >🏠</button>

      {showLogin && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(10,14,20,0.65)',
            backdropFilter: 'blur(8px)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setShowLogin(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 28, padding: '44px 40px 36px',
              width: 340, boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
              fontFamily: 'Nunito, sans-serif', textAlign: 'center'
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: '0 auto 20px',
              background: 'var(--site-btn, #1e1a16)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
            }}>🏠</div>

            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>Admin-Bereich</h2>
            <p style={{ margin: '0 0 28px', fontSize: 13, color: '#999' }}>NordzypernImmo · PIN eingeben</p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 20 }}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={refs[i]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{
                    width: 56, height: 64, textAlign: 'center',
                    fontSize: 28, fontWeight: 800,
                    border: `2px solid ${error ? '#ef4444' : d ? 'var(--site-btn, #1e1a16)' : '#e5e7eb'}`,
                    borderRadius: 14, outline: 'none',
                    background: error ? '#fff5f5' : d ? '#f8f7f5' : 'white',
                    color: '#1a1a1a', transition: 'border-color 0.2s, background 0.2s',
                    caretColor: 'transparent',
                  }}
                />
              ))}
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 600, margin: '0 0 12px' }}>
                ❌ Falscher PIN — bitte erneut versuchen
              </p>
            )}

            <p style={{ margin: 0, fontSize: 12, color: '#ccc' }}>
              4-stelligen PIN eingeben — bestätigt automatisch
            </p>
          </div>
        </div>
      )}
    </>
  )
}
