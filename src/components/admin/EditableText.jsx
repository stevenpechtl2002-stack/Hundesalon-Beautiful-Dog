import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '../../context/AdminContext'

export default function EditableText({ path, tag: Tag = 'span', className, style, children }) {
  const { isAdmin, updateField } = useAdmin()
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(children)
  const ref = useRef(null)

  useEffect(() => { setVal(children) }, [children])

  useEffect(() => {
    if (editing && ref.current) ref.current.focus()
  }, [editing])

  if (!isAdmin) return <Tag className={className} style={style}>{children}</Tag>

  if (editing) {
    return (
      <textarea
        ref={ref}
        value={val}
        onChange={e => setVal(e.target.value)}
        onBlur={() => { updateField(path, val); setEditing(false) }}
        onKeyDown={e => { if (e.key === 'Escape') setEditing(false) }}
        className={className}
        style={{
          ...style,
          outline: '2px solid #FFB5D8',
          borderRadius: 6,
          background: 'rgba(255,181,216,0.08)',
          resize: 'none',
          width: '100%',
          minHeight: 40,
          padding: '4px 8px',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          fontWeight: 'inherit',
          lineHeight: 'inherit',
        }}
        rows={val?.split('\n').length || 1}
      />
    )
  }

  return (
    <Tag
      className={className}
      style={{ ...style, cursor: 'pointer', position: 'relative' }}
      onClick={() => setEditing(true)}
      title="Klicken zum Bearbeiten"
    >
      {children}
      <span style={{
        position: 'absolute', top: -8, right: -8,
        background: '#FFB5D8', color: 'white', borderRadius: '50%',
        width: 20, height: 20, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 10, pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(255,181,216,0.6)'
      }}>✏️</span>
    </Tag>
  )
}
