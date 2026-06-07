import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'

const EMPTY = {
  title: '', location: '', region: 'Kyrenia',
  type: 'wohnung', deal: 'kaufen', price: '',
  rooms: '', baths: '', sqm: '', year: new Date().getFullYear(),
  floor: '', parking: false, tags: '', description: '',
  features: '', images: ['', '', ''], inMarquee: false,
}

const REGIONS = ['Kyrenia', 'Famagusta', 'Iskele', 'Nikosia']

function Toggle({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700,
      cursor: 'pointer', border: '2px solid',
      borderColor: active ? 'var(--site-btn, #1e1a16)' : '#e5e7eb',
      background: active ? 'var(--site-btn, #1e1a16)' : 'white',
      color: active ? 'white' : '#666',
      transition: 'all 0.15s',
    }}>{children}</button>
  )
}

function Inp({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 12, fontSize: 14,
  border: '1.5px solid #e5e7eb', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'Nunito, sans-serif', color: '#1a1a1a', background: 'white',
}

function PropertyForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...initial,
    tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags || ''),
    features: Array.isArray(initial?.features) ? initial.features.join(', ') : (initial?.features || ''),
    images: initial?.images?.length
      ? [...initial.images, '', '', ''].slice(0, 3)
      : ['', '', ''],
  }))

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setImg = (i, v) => setForm(f => {
    const imgs = [...f.images]; imgs[i] = v; return { ...f, images: imgs }
  })

  function handleSave() {
    if (!form.title.trim()) return alert('Bitte Titel eingeben')
    if (!form.price) return alert('Bitte Preis eingeben')
    onSave({
      ...form,
      price: Number(form.price),
      rooms: Number(form.rooms) || 0,
      baths: Number(form.baths) || 0,
      sqm: Number(form.sqm) || 0,
      year: Number(form.year) || new Date().getFullYear(),
      floor: form.floor ? Number(form.floor) : null,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      features: form.features.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.filter(Boolean),
    })
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Titel full width */}
        <div style={{ gridColumn: '1/-1' }}>
          <Inp label="Titel *">
            <input style={inputStyle} value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="z.B. Luxusvilla mit Infinity-Pool · Meerblick" />
          </Inp>
        </div>

        <Inp label="Standort">
          <input style={inputStyle} value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="z.B. Kyrenia · Meerblick" />
        </Inp>

        <Inp label="Region">
          <select style={inputStyle} value={form.region}
            onChange={e => set('region', e.target.value)}>
            {REGIONS.map(r => <option key={r}>{r}</option>)}
          </select>
        </Inp>

        <Inp label="Immobilientyp">
          <div style={{ display: 'flex', gap: 8 }}>
            <Toggle active={form.type === 'haus'} onClick={() => set('type', 'haus')}>🏠 Haus / Villa</Toggle>
            <Toggle active={form.type === 'wohnung'} onClick={() => set('type', 'wohnung')}>🏢 Wohnung</Toggle>
          </div>
        </Inp>

        <Inp label="Angebot">
          <div style={{ display: 'flex', gap: 8 }}>
            <Toggle active={form.deal === 'kaufen'} onClick={() => set('deal', 'kaufen')}>💰 Kaufen</Toggle>
            <Toggle active={form.deal === 'mieten'} onClick={() => set('deal', 'mieten')}>🔑 Mieten</Toggle>
          </div>
        </Inp>

        <Inp label={form.deal === 'mieten' ? 'Preis pro Monat (€) *' : 'Kaufpreis (€) *'}>
          <input style={inputStyle} type="number" value={form.price}
            onChange={e => set('price', e.target.value)}
            placeholder="z.B. 295000" />
        </Inp>

        <Inp label="Baujahr">
          <input style={inputStyle} type="number" value={form.year}
            onChange={e => set('year', e.target.value)} />
        </Inp>

        <Inp label="Zimmer (Schlafzimmer)">
          <input style={inputStyle} type="number" value={form.rooms}
            onChange={e => set('rooms', e.target.value)} placeholder="3" />
        </Inp>

        <Inp label="Badezimmer">
          <input style={inputStyle} type="number" value={form.baths}
            onChange={e => set('baths', e.target.value)} placeholder="2" />
        </Inp>

        <Inp label="Wohnfläche (m²)">
          <input style={inputStyle} type="number" value={form.sqm}
            onChange={e => set('sqm', e.target.value)} placeholder="120" />
        </Inp>

        <Inp label="Etage (leer lassen für EG / Villa)">
          <input style={inputStyle} type="number" value={form.floor ?? ''}
            onChange={e => set('floor', e.target.value)}
            placeholder="leer = Erdgeschoss / Villa" />
        </Inp>

        <div style={{ gridColumn: '1/-1' }}>
          <Inp label="Tags — kommagetrennt (z.B. Pool, Neubau, Meerblick)">
            <input style={inputStyle} value={form.tags}
              onChange={e => set('tags', e.target.value)}
              placeholder="Pool, Neubau, Meerblick, Terrasse" />
          </Inp>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Inp label="Ausstattung — kommagetrennt (erscheint als Checkliste auf der Detailseite)">
            <input style={inputStyle} value={form.features}
              onChange={e => set('features', e.target.value)}
              placeholder="Klimaanlage, Balkon, Pool, Einbauküche, Tiefgarage" />
          </Inp>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Inp label="Beschreibung">
            <textarea style={{ ...inputStyle, minHeight: 110, resize: 'vertical' }}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Objektbeschreibung — wird auf der Detailseite angezeigt…" />
          </Inp>
        </div>

        <div style={{ gridColumn: '1/-1' }}>
          <Inp label="Bilder (URLs) — Bild 1 ist das Hauptbild">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  {form.images[i] ? (
                    <img src={form.images[i]} alt="" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1px solid #eee' }} />
                  ) : (
                    <div style={{ width: 72, height: 52, borderRadius: 10, background: '#f5f5f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#ccc' }}>🖼</div>
                  )}
                  <input style={{ ...inputStyle, margin: 0 }} value={form.images[i]}
                    onChange={e => setImg(i, e.target.value)}
                    placeholder={i === 0 ? 'Hauptbild URL (Pflicht)' : `Bild ${i + 1} URL (optional)`} />
                </div>
              ))}
            </div>
          </Inp>
        </div>

        <div>
          <Inp label="Im Laufband anzeigen">
            <div style={{ display: 'flex', gap: 8 }}>
              <Toggle active={form.inMarquee} onClick={() => set('inMarquee', true)}>✅ Ja</Toggle>
              <Toggle active={!form.inMarquee} onClick={() => set('inMarquee', false)}>❌ Nein</Toggle>
            </div>
          </Inp>
        </div>

        <div>
          <Inp label="Parkplatz vorhanden">
            <div style={{ display: 'flex', gap: 8 }}>
              <Toggle active={form.parking === true} onClick={() => set('parking', true)}>✅ Ja</Toggle>
              <Toggle active={form.parking === false} onClick={() => set('parking', false)}>❌ Nein</Toggle>
            </div>
          </Inp>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid #eee' }}>
        <button onClick={handleSave} style={{
          flex: 1, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800,
          border: 'none', cursor: 'pointer',
          background: 'var(--site-btn, #1e1a16)', color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          💾 Inserat speichern
        </button>
        <button onClick={onCancel} style={{
          padding: '14px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700,
          border: '2px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#666',
        }}>
          Abbrechen
        </button>
      </div>
    </div>
  )
}

export default function AdminInseratePage() {
  const navigate = useNavigate()
  const { isAdmin, content, addProperty, updateProperty, deleteProperty, saveContent, saving, saveMsg } = useAdmin()
  const properties = content?.properties || []

  const [view, setView] = useState('list') // 'list' | 'new' | number (id)
  const [confirmDelete, setConfirmDelete] = useState(null)

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Nunito, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#aaa' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🔒</p>
          <p style={{ fontSize: 18, fontWeight: 700 }}>Nur für Administratoren</p>
          <button onClick={() => navigate('/')} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#1e1a16', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
            Zurück zur Startseite
          </button>
        </div>
      </div>
    )
  }

  const editingProperty = typeof view === 'number' ? properties.find(p => p.id === view) : null

  function handleSave(data) {
    if (view === 'new') addProperty(data)
    else updateProperty(view, data)
    setView('list')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f5', fontFamily: 'Nunito, sans-serif', paddingTop: 52 }}>

      {/* Page header */}
      <div style={{ background: 'white', borderBottom: '1px solid #eee', padding: '24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {view !== 'list' && (
              <button onClick={() => setView('list')} style={{
                background: '#f0ede8', border: 'none', borderRadius: 10, padding: '8px 16px',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', color: '#555'
              }}>← Zurück</button>
            )}
            <div>
              <p style={{ margin: 0, fontSize: 12, color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin · NordzypernImmo</p>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1a1a1a' }}>
                {view === 'new' ? '+ Neues Inserat' : typeof view === 'number' ? '✏️ Inserat bearbeiten' : '🏠 Inserate verwalten'}
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {saveMsg && <span style={{ fontSize: 13, color: saveMsg.includes('✅') ? '#16a34a' : '#ef4444', fontWeight: 700 }}>{saveMsg}</span>}
            {view === 'list' && (
              <button onClick={() => setView('new')} style={{
                padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 800,
                border: 'none', cursor: 'pointer', background: 'var(--site-btn, #1e1a16)', color: 'white',
              }}>+ Neues Inserat</button>
            )}
            <button onClick={saveContent} disabled={saving} style={{
              padding: '10px 22px', borderRadius: 12, fontSize: 14, fontWeight: 700,
              border: '2px solid var(--site-btn, #1e1a16)', cursor: 'pointer',
              background: saving ? '#eee' : 'white', color: 'var(--site-btn, #1e1a16)',
            }}>
              {saving ? 'Speichert…' : '💾 Auf Website speichern'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px' }}>

        {/* FORM VIEW */}
        {(view === 'new' || typeof view === 'number') && (
          <div style={{ background: 'white', borderRadius: 24, padding: '40px', boxShadow: '0 4px 30px rgba(0,0,0,0.07)', border: '1px solid #eee' }}>
            <h2 style={{ margin: '0 0 28px', fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>
              {view === 'new' ? 'Neue Immobilie eintragen' : `„${editingProperty?.title}" bearbeiten`}
            </h2>
            <PropertyForm
              initial={view === 'new' ? EMPTY : editingProperty}
              onSave={handleSave}
              onCancel={() => setView('list')}
            />
          </div>
        )}

        {/* LIST VIEW */}
        {view === 'list' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: 14, color: '#888', fontWeight: 600 }}>
                {properties.length} Inserate · {properties.filter(p => p.inMarquee).length} im Laufband
              </p>
            </div>

            {properties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 80, background: 'white', borderRadius: 24, border: '2px dashed #ddd' }}>
                <p style={{ fontSize: 48, margin: '0 0 12px' }}>🏠</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#999', margin: '0 0 8px' }}>Noch keine Inserate</p>
                <p style={{ fontSize: 14, color: '#bbb', marginBottom: 24 }}>Füge das erste Objekt hinzu</p>
                <button onClick={() => setView('new')} style={{
                  padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 800,
                  border: 'none', cursor: 'pointer', background: 'var(--site-btn, #1e1a16)', color: 'white'
                }}>+ Erstes Inserat eintragen</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 16 }}>
                {properties.map(p => (
                  <div key={p.id} style={{
                    background: 'white', borderRadius: 20, overflow: 'hidden',
                    border: '1.5px solid #eee', boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                    display: 'grid', gridTemplateColumns: '140px 1fr auto',
                    alignItems: 'stretch',
                  }}>
                    {/* Thumbnail */}
                    <div style={{ overflow: 'hidden', background: '#f5f3f0' }}>
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#ccc' }}>🏠</div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase',
                          background: p.deal === 'mieten' ? '#e0f2fe' : '#f0ede8',
                          color: p.deal === 'mieten' ? '#0284c7' : '#7a6e65',
                        }}>{p.deal === 'mieten' ? 'Mieten' : 'Kaufen'}</span>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#f5f3f0', color: '#888', textTransform: 'uppercase' }}>
                          {p.type === 'haus' ? 'Haus' : 'Wohnung'}
                        </span>
                        {p.inMarquee && (
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#f0fdf4', color: '#16a34a' }}>
                            ✅ Im Laufband
                          </span>
                        )}
                      </div>

                      <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>{p.title}</h3>
                      <p style={{ margin: '0 0 10px', fontSize: 13, color: '#999' }}>📍 {p.location} · {p.region}</p>

                      <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#666', fontWeight: 600 }}>
                        <span>🛏 {p.rooms} Zimmer</span>
                        <span>🚿 {p.baths} Bad</span>
                        <span>📐 {p.sqm} m²</span>
                        <span>📅 {p.year}</span>
                      </div>

                      <p style={{ margin: '10px 0 0', fontSize: 20, fontWeight: 800, color: 'var(--site-btn, #1e1a16)' }}>
                        €{Number(p.price).toLocaleString('de-DE')}{p.deal === 'mieten' ? ' /Mo' : ''}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 20px 20px 0', justifyContent: 'center', minWidth: 160 }}>
                      <button onClick={() => setView(p.id)} style={{
                        padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                        border: '1.5px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#333',
                      }}>✏️ Bearbeiten</button>

                      <button onClick={() => updateProperty(p.id, { inMarquee: !p.inMarquee })} style={{
                        padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                        border: '1.5px solid',
                        borderColor: p.inMarquee ? '#16a34a' : '#e5e7eb',
                        cursor: 'pointer',
                        background: p.inMarquee ? '#f0fdf4' : 'white',
                        color: p.inMarquee ? '#16a34a' : '#aaa',
                      }}>
                        {p.inMarquee ? '✅ Im Laufband' : '⬜ Laufband ein'}
                      </button>

                      {confirmDelete === p.id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => { deleteProperty(p.id); setConfirmDelete(null) }} style={{
                            flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 800,
                            border: 'none', cursor: 'pointer', background: '#ef4444', color: 'white'
                          }}>Ja, löschen</button>
                          <button onClick={() => setConfirmDelete(null)} style={{
                            flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                            border: '1px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#666'
                          }}>Nein</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(p.id)} style={{
                          padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                          border: '1.5px solid #fee2e2', cursor: 'pointer', background: 'white', color: '#f87171',
                        }}>🗑️ Löschen</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
