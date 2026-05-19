import { useRef } from 'react'
import { useAdmin } from '../../context/AdminContext'

export default function EditableImage({ path, src, alt, className, style, fallback }) {
  const { isAdmin, updateField } = useAdmin()
  const inputRef = useRef(null)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateField(path, ev.target.result)
    reader.readAsDataURL(file)
  }

  if (!isAdmin) {
    return src
      ? <img src={src} alt={alt} className={className} style={style} />
      : fallback || null
  }

  return (
    <div className={className} style={{ ...style, position: 'relative', cursor: 'pointer' }} onClick={() => inputRef.current.click()}>
      {src
        ? <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <div style={{ width: '100%', height: '100%', background: 'rgba(255,181,216,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
            {fallback}
          </div>
      }
      <div style={{
        position: 'absolute', inset: 0, background: 'rgba(255,181,216,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'inherit', opacity: 0, transition: 'opacity 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = 1}
        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
        <div style={{ background: 'white', borderRadius: 12, padding: '10px 18px', fontFamily: 'sans-serif', fontSize: 14, fontWeight: 700, color: '#e07fa0', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          🖼️ Bild ändern
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}
