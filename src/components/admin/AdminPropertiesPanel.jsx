import { useState } from 'react'
import { useAdmin } from '../../context/AdminContext'

const EMPTY = {
  title: '', location: '', region: 'Kyrenia',
  type: 'wohnung', deal: 'kaufen', price: '',
  rooms: '', baths: '', sqm: '', year: new Date().getFullYear(), floor: '', parking: false,
  tags: '', description: '', features: '',
  images: ['', '', ''],
  inMarquee: false,
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#666', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
      {children}
    </div>
  )
}

const inp = {
  width: '100%', padding: '9px 12px', borderRadius: 10, fontSize: 14,
  border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Nunito, sans-serif', color: '#1a1a1a', background: 'white',
}

const toggleStyle = (active) => ({
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
  border: '1.5px solid ' + (active ? 'var(--site-btn, #1e1a16)' : '#e5e7eb'),
  background: active ? 'var(--site-btn, #1e1a16)' : 'white',
  color: active ? 'white' : '#666',
})

function PropertyForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    ...EMPTY,
    ...initial,
    tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags || ''),
    features: Array.isArray(initial?.features) ? initial.features.join(', ') : (initial?.features || ''),
    images: initial?.images?.length ? [...initial.images, '', '', ''].slice(0, 3) : ['', '', ''],
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setImg = (i, v) => setForm(f => { const imgs = [...f.images]; imgs[i] = v; return { ...f, images: imgs } })

  function handleSave() {
    const result = {
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms),
      baths: Number(form.baths),
      sqm: Number(form.sqm),
      year: Number(form.year),
      floor: form.floor ? Number(form.floor) : null,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
    }
    onSave(result)
  }

  return (
    <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <div style={{ gridColumn: '1/-1' }}>
          <Field label="Titel">
            <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="z.B. Luxusvilla Kyrenia" />
          </Field>
        </div>
        <Field label="Standort">
          <input style={inp} value={form.location} onChange={e => set('location', e.target.value)} placeholder="z.B. Kyrenia · Meerblick" />
        </Field>
        <Field label="Region">
          <select style={inp} value={form.region} onChange={e => set('region', e.target.value)}>
            {['Kyrenia', 'Famagusta', 'Iskele', 'Nikosia'].map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Typ">
          <div style={{ display: 'flex', gap: 8 }}>
            {[['wohnung', '🏢 Wohnung'], ['haus', '🏠 Haus']].map(([v, l]) => (
              <button key={v} style={toggleStyle(form.type === v)} onClick={() => set('type', v)}>{l}</button>
            ))}
          </div>
        </Field>
        <Field label="Angebot">
          <div style={{ display: 'flex', gap: 8 }}>
            {[['kaufen', '💰 Kaufen'], ['mieten', '🔑 Mieten']].map(([v, l]) => (
              <button key={v} style={toggleStyle(form.deal === v)} onClick={() => set('deal', v)}>{l}</button>
            ))}
          </div>
        </Field>
        <Field label={form.deal === 'mieten' ? 'Preis / Monat (€)' : 'Kaufpreis (€)'}>
          <input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="z.B. 295000" />
        </Field>
        <Field label="Baujahr">
          <input style={inp} type="number" value={form.year} onChange={e => set('year', e.target.value)} />
        </Field>
        <Field label="Zimmer">
          <input style={inp} type="number" value={form.rooms} onChange={e => set('rooms', e.target.value)} placeholder="3" />
        </Field>
        <Field label="Badezimmer">
          <input style={inp} type="number" value={form.baths} onChange={e => set('baths', e.target.value)} placeholder="2" />
        </Field>
        <Field label="Wohnfläche (m²)">
          <input style={inp} type="number" value={form.sqm} onChange={e => set('sqm', e.target.value)} placeholder="120" />
        </Field>
        <Field label="Etage (leer = Villa/EG)">
          <input style={inp} type="number" value={form.floor ?? ''} onChange={e => set('floor', e.target.value)} placeholder="leer lassen für EG/Villa" />
        </Field>
      </div>

      <Field label="Tags (kommagetrennt)">
        <input style={inp} value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Pool, Neubau, Meerblick" />
      </Field>

      <Field label="Ausstattung (kommagetrennt)">
        <input style={inp} value={form.features} onChange={e => set('features', e.target.value)} placeholder="Klimaanlage, Balkon, Pool" />
      </Field>

      <Field label="Beschreibung">
        <textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Kurze Objektbeschreibung…" />
      </Field>

      <Field label="Bilder (URLs — Bild 1 = Hauptbild)">
        {[0, 1, 2].map(i => (
          <input key={i} style={{ ...inp, marginBottom: 8 }} value={form.images[i]} onChange={e => setImg(i, e.target.value)} placeholder={`Bild ${i + 1} URL`} />
        ))}
      </Field>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
        <Field label="Im Laufband anzeigen">
          <button style={toggleStyle(form.inMarquee)} onClick={() => set('inMarquee', !form.inMarquee)}>
            {form.inMarquee ? '✅ Im Laufband' : '⬜ Nicht im Laufband'}
          </button>
        </Field>
        <Field label="Parkplatz">
          <button style={toggleStyle(form.parking)} onClick={() => set('parking', !form.parking)}>
            {form.parking ? '✅ Vorhanden' : '❌ Keiner'}
          </button>
        </Field>
      </div>

      <div style={{ display: 'flex', gap: 10, paddingBottom: 24 }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700,
          border: 'none', cursor: 'pointer', background: 'var(--site-btn, #1e1a16)', color: 'white'
        }}>
          💾 Speichern
        </button>
        <button onClick={onCancel} style={{
          padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
          border: '1.5px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#666'
        }}>
          Abbrechen
        </button>
      </div>
    </div>
  )
}

export default function AdminPropertiesPanel({ onClose }) {
  const { content, addProperty, updateProperty, deleteProperty } = useAdmin()
  const properties = content?.properties || []
  const [editing, setEditing] = useState(null) // null = list, 'new' = new form, id = edit form
  const [confirmDelete, setConfirmDelete] = useState(null)

  const activeProperty = editing && editing !== 'new' ? properties.find(p => p.id === editing) : null

  function handleSave(data) {
    if (editing === 'new') addProperty(data)
    else updateProperty(editing, data)
    setEditing(null)
  }

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 9997,
      width: 480, background: '#f8f7f5',
      boxShadow: '-8px 0 48px rgba(0,0,0,0.18)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Nunito, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 24px', background: 'var(--site-btn, #1e1a16)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 2 }}>Admin</p>
          <h2 style={{ margin: 0, color: 'white', fontSize: 18, fontWeight: 800 }}>
            {editing === 'new' ? '+ Neues Inserat' : editing ? '✏️ Inserat bearbeiten' : '🏠 Inserate verwalten'}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {editing && (
            <button onClick={() => setEditing(null)} style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
            }}>← Zurück</button>
          )}
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            color: 'white', borderRadius: 10, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer'
          }}>✕ Schließen</button>
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <PropertyForm
          initial={editing === 'new' ? EMPTY : activeProperty}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {/* New button */}
          <button onClick={() => setEditing('new')} style={{
            width: '100%', padding: '13px', borderRadius: 14, fontSize: 14, fontWeight: 700,
            border: '2px dashed #ccc', cursor: 'pointer', background: 'white', color: '#555',
            marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            ＋ Neues Inserat hinzufügen
          </button>

          {/* Property list */}
          {properties.map(p => (
            <div key={p.id} style={{
              background: 'white', borderRadius: 16, marginBottom: 10, overflow: 'hidden',
              border: '1.5px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', gap: 12, padding: 14, alignItems: 'flex-start' }}>
                {/* Thumbnail */}
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt={p.title} style={{
                    width: 76, height: 58, objectFit: 'cover', borderRadius: 10, flexShrink: 0
                  }} />
                ) : (
                  <div style={{ width: 76, height: 58, borderRadius: 10, background: '#f0ede8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🏠</div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</p>
                  <p style={{ margin: '2px 0 6px', fontSize: 12, color: '#999' }}>
                    📍 {p.location} · {p.rooms} Zi. · {p.sqm} m²
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--site-btn, #1e1a16)' }}>
                      €{Number(p.price).toLocaleString('de-DE')}{p.deal === 'mieten' ? '/Mo' : ''}
                    </span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: p.deal === 'mieten' ? '#e0f2fe' : '#f0ede8', color: '#555', fontWeight: 700 }}>
                      {p.deal === 'mieten' ? 'Mieten' : 'Kaufen'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #f3f3f3' }}>
                {/* Marquee toggle */}
                <button
                  onClick={() => updateProperty(p.id, { inMarquee: !p.inMarquee })}
                  style={{
                    flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: 'none', borderRight: '1px solid #f3f3f3',
                    background: p.inMarquee ? '#f0fdf4' : 'white',
                    color: p.inMarquee ? '#16a34a' : '#aaa',
                  }}
                  title="Im Laufband anzeigen"
                >
                  {p.inMarquee ? '✅ Im Laufband' : '⬜ Laufband aus'}
                </button>

                {/* Edit */}
                <button
                  onClick={() => setEditing(p.id)}
                  style={{
                    flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: 'none', borderRight: '1px solid #f3f3f3', background: 'white', color: '#555',
                  }}
                >
                  ✏️ Bearbeiten
                </button>

                {/* Delete */}
                {confirmDelete === p.id ? (
                  <button
                    onClick={() => { deleteProperty(p.id); setConfirmDelete(null) }}
                    style={{ flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: '#fff5f5', color: '#ef4444' }}
                  >
                    ⚠️ Löschen?
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(p.id)}
                    style={{ flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: 'white', color: '#ccc' }}
                  >
                    🗑️ Löschen
                  </button>
                )}
              </div>
            </div>
          ))}

          {properties.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#bbb' }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🏠</p>
              <p style={{ fontSize: 14 }}>Noch keine Inserate vorhanden</p>
            </div>
          )}

          <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 16 }}>
            Änderungen werden mit "💾 Speichern" in der Admin-Bar gesichert
          </p>
        </div>
      )}
    </div>
  )
}
