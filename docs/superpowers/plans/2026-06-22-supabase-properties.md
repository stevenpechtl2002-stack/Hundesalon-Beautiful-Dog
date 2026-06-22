# Supabase Properties Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate property listings and images from `public/content.json` + GitHub API to Supabase Postgres + Supabase Storage, enabling instant updates without Vercel redeploys.

**Architecture:** Frontend reads properties directly from Supabase via anon key (fast, no CDN cache). Admin writes go through Vercel serverless functions (`api/properties.js`, `api/upload-image.js`) that verify the PIN first, then use the service role key to write. The rest of the CMS (hero, services, testimonials, colors) stays in `content.json` unchanged. AdminContext merges Supabase properties into the existing `content` object so `PropertiesPage` and `PropertyMarquee` require zero changes.

**Tech Stack:** Vite + React, `@supabase/supabase-js`, Vercel serverless functions, Supabase Postgres + Storage

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/supabase.js` | Create | Supabase client (anon key, public reads) |
| `api/properties.js` | Create | GET/POST/PUT/DELETE for properties (PIN-gated writes) |
| `api/upload-image.js` | Create | Upload base64 image to Supabase Storage, return URL |
| `src/context/AdminContext.jsx` | Modify | Fetch properties from Supabase, CRUD via API |
| `src/pages/AdminInseratePage.jsx` | Modify | Upload images before saving, handle URL vs base64 |
| `api/save.js` | Modify | Remove properties from content save, remove image extraction |

---

## Task 0: Supabase Project Setup (Manual Steps)

> These steps must be done by the user in the Supabase dashboard at supabase.com before any code is deployed.

- [ ] **Step 1: Create Supabase project**

  1. Go to supabase.com → "New project"
  2. Name: `nordzypern-immo`
  3. Region: Frankfurt (eu-central-1)
  4. Save the database password somewhere safe
  5. Wait for project to be ready (~1 min)

- [ ] **Step 2: Create the `properties` table**

  In Supabase → SQL Editor, run:

  ```sql
  CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    location TEXT,
    region TEXT,
    price NUMERIC,
    rooms INTEGER,
    baths INTEGER,
    sqm INTEGER,
    year INTEGER,
    floor INTEGER,
    parking BOOLEAN DEFAULT FALSE,
    deal TEXT,
    type TEXT,
    tags TEXT[],
    features TEXT[],
    description TEXT,
    images TEXT[],
    in_marquee BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- [ ] **Step 3: Enable Row Level Security and add policies**

  ```sql
  ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

  -- Anyone can read properties
  CREATE POLICY "public read" ON properties
    FOR SELECT USING (true);

  -- Only service role can write (INSERT/UPDATE/DELETE)
  -- No additional policy needed — service role bypasses RLS by default
  ```

- [ ] **Step 4: Create Supabase Storage bucket**

  In Supabase → Storage → "New bucket":
  - Name: `property-images`
  - Public bucket: ✅ YES (so images are publicly accessible)

- [ ] **Step 5: Copy your Supabase credentials**

  In Supabase → Settings → API:
  - Copy `Project URL` → this is `VITE_SUPABASE_URL`
  - Copy `anon public` key → this is `VITE_SUPABASE_ANON_KEY`
  - Copy `service_role secret` key → this is `SUPABASE_SERVICE_ROLE_KEY`

---

## Task 1: Install Supabase Client and Set Up Environment

**Files:**
- Create: `src/lib/supabase.js`
- Modify: `.env` (local)

- [ ] **Step 1: Install the Supabase JS client**

  ```bash
  cd "Hundesalon Fellraum Kopie"
  npm install @supabase/supabase-js
  ```

  Expected: `added 1 package` (or similar)

- [ ] **Step 2: Add env vars to `.env` (local only)**

  Open `.env` and add (replace with your actual values from Task 0 Step 5):

  ```
  VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
  ```

- [ ] **Step 3: Create `src/lib/supabase.js`**

  ```js
  import { createClient } from '@supabase/supabase-js'

  export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  )
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/lib/supabase.js package.json package-lock.json
  git commit -m "feat: install supabase client and create client module"
  ```

---

## Task 2: Create `api/properties.js` — CRUD Serverless Function

**Files:**
- Create: `api/properties.js`

This function handles all property operations. GET is public (no PIN). POST/PUT/DELETE require PIN.

- [ ] **Step 1: Create `api/properties.js`**

  ```js
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

  export default async function handler(req, res) {
    const supabase = getServiceClient()

    // GET — public, no PIN needed
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    }

    // All other methods require PIN
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (!checkPin(body)) return res.status(401).json({ error: 'Unauthorized' })

    // POST — create new property
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

    // PUT — update existing property
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

    // DELETE — remove property
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

  // Convert camelCase JS fields to snake_case DB columns
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
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add api/properties.js
  git commit -m "feat: add api/properties.js serverless function for Supabase CRUD"
  ```

---

## Task 3: Create `api/upload-image.js` — Image Upload to Supabase Storage

**Files:**
- Create: `api/upload-image.js`

Accepts a base64 image + PIN, uploads to Supabase Storage, returns the public URL.

- [ ] **Step 1: Create `api/upload-image.js`**

  ```js
  import { createClient } from '@supabase/supabase-js'

  export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end()

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { base64, password, ext } = body

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    if (!base64 || !ext) {
      return res.status(400).json({ error: 'Missing base64 or ext' })
    }

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(base64, 'base64')

    const { error } = await supabase.storage
      .from('property-images')
      .upload(fileName, buffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        upsert: false,
      })

    if (error) return res.status(500).json({ error: error.message })

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(fileName)

    return res.status(200).json({ url: data.publicUrl })
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add api/upload-image.js
  git commit -m "feat: add api/upload-image.js for Supabase Storage uploads"
  ```

---

## Task 4: Update `AdminContext.jsx` — Fetch Properties from Supabase

**Files:**
- Modify: `src/context/AdminContext.jsx`

Key changes:
- Add separate `properties` state fetched from Supabase
- `addProperty` → POST to `/api/properties`
- `updateProperty` → PUT to `/api/properties`
- `deleteProperty` → DELETE to `/api/properties`
- Expose `content` with properties injected in (so `PropertiesPage` and `PropertyMarquee` need no changes)

- [ ] **Step 1: Replace `src/context/AdminContext.jsx` with the new version**

  ```jsx
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

    // Fetch non-property CMS content from content.json
    useEffect(() => {
      fetch(`/content.json?v=${Date.now()}`)
        .then(r => r.json())
        .then(setContent)
    }, [])

    // Fetch properties from Supabase
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

    // Inject properties into content so PropertiesPage and PropertyMarquee need no changes
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
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/context/AdminContext.jsx
  git commit -m "feat: AdminContext fetches properties from Supabase"
  ```

---

## Task 5: Update `AdminInseratePage.jsx` — Upload Images to Supabase Storage

**Files:**
- Modify: `src/pages/AdminInseratePage.jsx`

Changes:
- `ImageUploader` stores previews locally (base64) as before, but tracks which are new vs. already-uploaded URLs
- On "Speichern": upload new base64 images to `/api/upload-image`, replace with returned URLs, then call `addProperty`/`updateProperty`
- Remove the manual "💾 Auf Website speichern" button (no longer needed — saves instantly)

- [ ] **Step 1: Update `compressImage` to also return the file extension**

  In [src/pages/AdminInseratePage.jsx](src/pages/AdminInseratePage.jsx), replace the `compressImage` function:

  ```js
  function compressImage(file, maxWidth = 1400, quality = 0.82) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let w = img.width, h = img.height
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }
  ```

  *(No change needed here — keeping as-is.)*

- [ ] **Step 2: Update `handleSave` in `PropertyForm` to upload images first**

  Replace the `PropertyForm` component's `handleSave` function. Also add `uploadImages` helper at the top of the component and add `uploading` state:

  ```jsx
  function PropertyForm({ initial, onSave, onCancel }) {
    const [form, setForm] = useState(() => ({
      ...EMPTY,
      ...initial,
      tags: Array.isArray(initial?.tags) ? initial.tags.join(', ') : (initial?.tags || ''),
      features: Array.isArray(initial?.features) ? initial.features.join(', ') : (initial?.features || ''),
      images: initial?.images || [],
    }))
    const [uploading, setUploading] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    async function uploadImages(images) {
      const password = import.meta.env.VITE_ADMIN_PASSWORD
      return Promise.all(images.map(async (img) => {
        // Already a URL (previously uploaded) — keep as-is
        if (!img.startsWith('data:')) return img
        const [meta, base64] = img.split(',')
        const ext = meta.split(';')[0].split('/')[1] === 'jpeg' ? 'jpg' : meta.split(';')[0].split('/')[1]
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, ext, password }),
        })
        if (!res.ok) throw new Error('Image upload failed')
        const { url } = await res.json()
        return url
      }))
    }

    async function handleSave() {
      if (!form.title.trim()) return alert('Bitte Titel eingeben')
      if (!form.price) return alert('Bitte Preis eingeben')
      setUploading(true)
      try {
        const uploadedImages = await uploadImages(form.images)
        onSave({
          ...form,
          images: uploadedImages,
          price: Number(form.price),
          rooms: Number(form.rooms) || 0,
          baths: Number(form.baths) || 0,
          sqm: Number(form.sqm) || 0,
          year: Number(form.year) || new Date().getFullYear(),
          floor: form.floor ? Number(form.floor) : null,
          tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
          features: form.features.split(',').map(s => s.trim()).filter(Boolean),
        })
      } catch {
        alert('Fehler beim Hochladen der Bilder. Bitte erneut versuchen.')
      }
      setUploading(false)
    }

    // ... rest of the JSX, but update the save button:
    // <button onClick={handleSave} disabled={uploading} style={...}>
    //   {uploading ? '⏳ Bilder werden hochgeladen…' : '💾 Inserat speichern'}
    // </button>
  ```

- [ ] **Step 3: Apply the full updated `AdminInseratePage.jsx`**

  Replace the entire file content with the updated version below. The key changes are:
  1. `PropertyForm` has `uploading` state + `uploadImages` async helper
  2. Save button shows upload progress
  3. Header no longer shows "Auf Website speichern" button (removed — not needed anymore)

  ```jsx
  import { useState, useRef, useCallback } from 'react'
  import { useNavigate } from 'react-router-dom'
  import { useAdmin } from '../context/AdminContext'

  const EMPTY = {
    title: '', location: '', region: 'Kyrenia',
    type: 'wohnung', deal: 'kaufen', price: '',
    rooms: '', baths: '', sqm: '', year: new Date().getFullYear(),
    floor: '', parking: false, tags: '', description: '',
    features: '', images: [], inMarquee: false,
  }

  const REGIONS = ['Kyrenia', 'Famagusta', 'Iskele', 'Nikosia']
  const MAX_PHOTOS = 20

  function compressImage(file, maxWidth = 1400, quality = 0.82) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let w = img.width, h = img.height
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', quality))
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  function ImageUploader({ images, onChange }) {
    const [dragging, setDragging] = useState(false)
    const [loading, setLoading] = useState(false)
    const inputRef = useRef()

    const processFiles = useCallback(async (files) => {
      const remaining = MAX_PHOTOS - images.length
      if (remaining <= 0) return
      const toProcess = Array.from(files).slice(0, remaining).filter(f => f.type.startsWith('image/'))
      if (!toProcess.length) return
      setLoading(true)
      const compressed = await Promise.all(toProcess.map(f => compressImage(f)))
      onChange([...images, ...compressed])
      setLoading(false)
    }, [images, onChange])

    function onDrop(e) {
      e.preventDefault()
      setDragging(false)
      processFiles(e.dataTransfer.files)
    }

    function onPaste(e) {
      const items = e.clipboardData?.items
      if (!items) return
      const files = Array.from(items).filter(i => i.kind === 'file').map(i => i.getAsFile())
      if (files.length) processFiles(files)
    }

    function removeImage(idx) { onChange(images.filter((_, i) => i !== idx)) }

    function moveImage(from, to) {
      if (to < 0 || to >= images.length) return
      const arr = [...images]
      const [item] = arr.splice(from, 1)
      arr.splice(to, 0, item)
      onChange(arr)
    }

    return (
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          Fotos ({images.length}/{MAX_PHOTOS}) — erstes Bild = Hauptbild
        </label>

        {images.length < MAX_PHOTOS && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onPaste={onPaste}
            tabIndex={0}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--site-btn, #1e1a16)' : '#d1d5db'}`,
              borderRadius: 16, padding: '32px 24px', textAlign: 'center', cursor: 'pointer',
              background: dragging ? '#f8f7f5' : 'white', transition: 'all 0.2s',
              marginBottom: images.length ? 16 : 0, outline: 'none',
            }}
          >
            {loading ? (
              <div>
                <p style={{ fontSize: 28, marginBottom: 8 }}>⏳</p>
                <p style={{ fontSize: 14, color: '#888', fontWeight: 600 }}>Bilder werden komprimiert…</p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 36, marginBottom: 10 }}>📸</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#444', margin: '0 0 4px' }}>
                  Fotos hierher ziehen oder klicken
                </p>
                <p style={{ fontSize: 13, color: '#aaa', margin: 0 }}>
                  Auch einfügen mit Strg+V / ⌘+V · Bis zu {MAX_PHOTOS} Fotos · JPG, PNG, WEBP
                </p>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => processFiles(e.target.files)}
            />
          </div>
        )}

        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {images.map((src, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: i === 0 ? '3px solid var(--site-btn, #1e1a16)' : '1.5px solid #e5e7eb', aspectRatio: '4/3' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {i === 0 && (
                  <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 10, fontWeight: 800, background: 'var(--site-btn, #1e1a16)', color: 'white', padding: '2px 7px', borderRadius: 6 }}>
                    HAUPT
                  </span>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.45)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 6px 6px', opacity: 0, transition: 'opacity 0.2s' }}
                    ref={el => {
                      if (el) {
                        el.parentElement.addEventListener('mouseenter', () => el.style.opacity = '1')
                        el.parentElement.addEventListener('mouseleave', () => el.style.opacity = '0')
                      }
                    }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => moveImage(i, i - 1)} disabled={i === 0}
                        style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: i === 0 ? 'not-allowed' : 'pointer', fontSize: 12, opacity: i === 0 ? 0.3 : 1 }}>◀</button>
                      <button onClick={() => moveImage(i, i + 1)} disabled={i === images.length - 1}
                        style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.9)', cursor: i === images.length - 1 ? 'not-allowed' : 'pointer', fontSize: 12, opacity: i === images.length - 1 ? 0.3 : 1 }}>▶</button>
                    </div>
                    <button onClick={() => removeImage(i)}
                      style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  function Toggle({ active, onClick, children }) {
    return (
      <button onClick={onClick} style={{
        padding: '8px 16px', borderRadius: 10, fontSize: 14, fontWeight: 700,
        cursor: 'pointer', border: '2px solid',
        borderColor: active ? 'var(--site-btn, #1e1a16)' : '#e5e7eb',
        background: active ? 'var(--site-btn, #1e1a16)' : 'white',
        color: active ? 'white' : '#666', transition: 'all 0.15s',
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
      images: initial?.images || [],
    }))
    const [uploading, setUploading] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    async function uploadImages(images) {
      const password = import.meta.env.VITE_ADMIN_PASSWORD
      return Promise.all(images.map(async (img) => {
        if (!img.startsWith('data:')) return img
        const [meta, base64] = img.split(',')
        const rawExt = meta.split(';')[0].split('/')[1]
        const ext = rawExt === 'jpeg' ? 'jpg' : rawExt
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, ext, password }),
        })
        if (!res.ok) throw new Error('Image upload failed')
        const { url } = await res.json()
        return url
      }))
    }

    async function handleSave() {
      if (!form.title.trim()) return alert('Bitte Titel eingeben')
      if (!form.price) return alert('Bitte Preis eingeben')
      setUploading(true)
      try {
        const uploadedImages = await uploadImages(form.images)
        onSave({
          ...form,
          images: uploadedImages,
          price: Number(form.price),
          rooms: Number(form.rooms) || 0,
          baths: Number(form.baths) || 0,
          sqm: Number(form.sqm) || 0,
          year: Number(form.year) || new Date().getFullYear(),
          floor: form.floor ? Number(form.floor) : null,
          tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
          features: form.features.split(',').map(s => s.trim()).filter(Boolean),
        })
      } catch {
        alert('Fehler beim Hochladen der Bilder. Bitte erneut versuchen.')
      }
      setUploading(false)
    }

    return (
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

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
              onChange={e => set('price', e.target.value)} placeholder="z.B. 295000" />
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

          <Inp label="Etage (leer = EG / Villa)">
            <input style={inputStyle} type="number" value={form.floor ?? ''}
              onChange={e => set('floor', e.target.value)} placeholder="leer lassen für EG / Villa" />
          </Inp>

          <div style={{ gridColumn: '1/-1' }}>
            <Inp label="Tags — kommagetrennt">
              <input style={inputStyle} value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="Pool, Neubau, Meerblick, Terrasse" />
            </Inp>
          </div>

          <div style={{ gridColumn: '1/-1' }}>
            <Inp label="Ausstattung — kommagetrennt (Checkliste auf Detailseite)">
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
                placeholder="Objektbeschreibung…" />
            </Inp>
          </div>

          <div style={{ gridColumn: '1/-1', background: '#f8f7f5', borderRadius: 16, padding: 20 }}>
            <ImageUploader
              images={form.images}
              onChange={imgs => set('images', imgs)}
            />
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

        <div style={{ display: 'flex', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid #eee' }}>
          <button onClick={handleSave} disabled={uploading} style={{
            flex: 1, padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800,
            border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
            background: uploading ? '#888' : 'var(--site-btn, #1e1a16)', color: 'white',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>{uploading ? '⏳ Bilder werden hochgeladen…' : '💾 Inserat speichern'}</button>
          <button onClick={onCancel} style={{
            padding: '14px 28px', borderRadius: 14, fontSize: 15, fontWeight: 700,
            border: '2px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#666',
          }}>Abbrechen</button>
        </div>
      </div>
    )
  }

  export default function AdminInseratePage() {
    const navigate = useNavigate()
    const { isAdmin, content, addProperty, updateProperty, deleteProperty, saving, saveMsg } = useAdmin()
    const properties = content?.properties || []
    const [view, setView] = useState('list')
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

    async function handleSave(data) {
      if (view === 'new') await addProperty(data)
      else await updateProperty(view, data)
      setView('list')
    }

    return (
      <div style={{ minHeight: '100vh', background: '#f8f7f5', fontFamily: 'Nunito, sans-serif', paddingTop: 52 }}>

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
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px' }}>

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
                      display: 'grid', gridTemplateColumns: '140px 1fr auto', alignItems: 'stretch',
                    }}>
                      <div style={{ overflow: 'hidden', background: '#f5f3f0' }}>
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#ccc', minHeight: 100 }}>🏠</div>
                        )}
                      </div>

                      <div style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase', background: p.deal === 'mieten' ? '#e0f2fe' : '#f0ede8', color: p.deal === 'mieten' ? '#0284c7' : '#7a6e65' }}>{p.deal === 'mieten' ? 'Mieten' : 'Kaufen'}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#f5f3f0', color: '#888', textTransform: 'uppercase' }}>{p.type === 'haus' ? 'Haus' : 'Wohnung'}</span>
                          {p.inMarquee && <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 6, background: '#f0fdf4', color: '#16a34a' }}>✅ Im Laufband</span>}
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6, background: '#f5f3f0', color: '#aaa' }}>{p.images?.length || 0} Fotos</span>
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

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '20px 20px 20px 0', justifyContent: 'center', minWidth: 160 }}>
                        <button onClick={() => setView(p.id)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1.5px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#333' }}>✏️ Bearbeiten</button>
                        <button onClick={() => updateProperty(p.id, { ...p, inMarquee: !p.inMarquee })} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1.5px solid', borderColor: p.inMarquee ? '#16a34a' : '#e5e7eb', cursor: 'pointer', background: p.inMarquee ? '#f0fdf4' : 'white', color: p.inMarquee ? '#16a34a' : '#aaa' }}>
                          {p.inMarquee ? '✅ Im Laufband' : '⬜ Laufband ein'}
                        </button>
                        {confirmDelete === p.id ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => { deleteProperty(p.id); setConfirmDelete(null) }} style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', background: '#ef4444', color: 'white' }}>Ja, löschen</button>
                            <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: '8px', borderRadius: 10, fontSize: 12, fontWeight: 700, border: '1px solid #e5e7eb', cursor: 'pointer', background: 'white', color: '#666' }}>Nein</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(p.id)} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1.5px solid #fee2e2', cursor: 'pointer', background: 'white', color: '#f87171' }}>🗑️ Löschen</button>
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
  ```

- [ ] **Step 4: Commit**

  ```bash
  git add src/pages/AdminInseratePage.jsx
  git commit -m "feat: AdminInseratePage uploads images to Supabase Storage before saving"
  ```

---

## Task 6: Update `api/save.js` — Remove Properties and Image Extraction

**Files:**
- Modify: `api/save.js`

Properties are no longer in `content.json`. Remove the `extractImages` function and all property-related logic.

- [ ] **Step 1: Replace `api/save.js` with the simplified version**

  ```js
  export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end()

    const { content, password } = req.body
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = process.env.GITHUB_TOKEN
    const owner = 'stevenpechtl2002-stack'
    const repo = 'Hundesalon-Beautiful-Dog'
    const path = 'public/content.json'

    // Get current file SHA
    const fileRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'nordzypern-immo-cms' }
    })
    const fileData = await fileRes.json()
    const sha = fileData.sha

    // Save content.json without properties (properties live in Supabase now)
    const contentWithoutProperties = { ...content }
    delete contentWithoutProperties.properties

    const newContent = Buffer.from(JSON.stringify(contentWithoutProperties, null, 2)).toString('base64')
    const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'nordzypern-immo-cms' },
      body: JSON.stringify({
        message: 'Admin: Inhalte aktualisiert',
        content: newContent,
        sha,
      })
    })

    if (updateRes.ok) return res.status(200).json({ ok: true })
    return res.status(500).json({ error: 'GitHub update failed' })
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add api/save.js
  git commit -m "feat: remove properties and image extraction from api/save.js"
  ```

---

## Task 7: Add Env Vars to Vercel and Deploy

- [ ] **Step 1: Add environment variables in Vercel dashboard**

  Go to vercel.com → Project → Settings → Environment Variables. Add:

  | Name | Value | Environment |
  |------|-------|-------------|
  | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Production, Preview, Development |
  | `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...` (anon key) | Production, Preview, Development |
  | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (service role key) | Production, Preview, Development |

  Also verify `ADMIN_PASSWORD` is set to the correct PIN (not a Stripe key).

- [ ] **Step 2: Push all changes to trigger Vercel deployment**

  ```bash
  git push origin main
  ```

  Expected: Vercel detects push, builds, and deploys in ~1-2 minutes.

- [ ] **Step 3: Verify the live site**

  1. Visit `https://www.nord-zypern-immo.com/immobilien` — should show 0 properties (empty state)
  2. Log into admin (bottom-right corner trigger → PIN)
  3. Go to `/admin/inserate` → create a test property with one photo
  4. Save → should appear immediately without page reload
  5. Visit `/immobilien` in a new private tab → property should be visible instantly (no redeploy needed!)
  6. Delete the test property → should disappear immediately
