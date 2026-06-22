# Supabase Integration für Immobilien & Bilder

**Datum:** 2026-06-22
**Projekt:** NordzypernImmo (Hundesalon Fellraum Kopie)
**Scope:** Nur Properties + Bilder migrieren. Alles andere (Hero, Services, Testimonials, Farben) bleibt in `public/content.json`.

---

## Ziel

- Properties werden in Supabase Postgres gespeichert (kein Redeploy mehr bei Änderungen)
- Bilder werden in Supabase Storage gespeichert (keine base64 in JSON mehr)
- Lesen: Frontend direkt via Supabase Anon-Key (schnell, kein CDN-Cache-Problem)
- Schreiben: Über Vercel-Funktionen, die erst den Admin-PIN prüfen, dann mit Service-Role-Key schreiben
- Admin-Login bleibt unverändert (PIN-basiert, `api/admin-login.js`)

---

## Datenbank-Schema

Tabelle: `properties`

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| `id` | BIGSERIAL PRIMARY KEY | Auto-increment ID |
| `title` | TEXT | Titel des Inserats |
| `location` | TEXT | Ort/Adresse |
| `region` | TEXT | Region (Kyrenia, Famagusta, Iskele, Nikosia) |
| `price` | NUMERIC | Preis in Euro |
| `rooms` | INTEGER | Anzahl Zimmer |
| `baths` | INTEGER | Anzahl Bäder |
| `sqm` | INTEGER | Quadratmeter |
| `deal` | TEXT | 'kaufen' oder 'mieten' |
| `type` | TEXT | 'haus' oder 'wohnung' |
| `tags` | TEXT[] | Array von Tags (z.B. ['Meerblick', 'Pool']) |
| `description` | TEXT | Beschreibungstext |
| `images` | TEXT[] | Array von Supabase Storage URLs |
| `in_marquee` | BOOLEAN | Soll im Marquee auf der Startseite erscheinen |
| `created_at` | TIMESTAMPTZ | Erstellungsdatum (automatisch) |

**Row Level Security (RLS):**
- SELECT: öffentlich (alle können lesen)
- INSERT/UPDATE/DELETE: gesperrt (nur über Service-Role-Key via Vercel-Backend)

---

## Supabase Storage

- Bucket: `property-images`
- Öffentlich lesbar (public bucket)
- Upload nur über `api/upload-image.js` mit Service-Role-Key
- Bildpfad-Schema: `properties/{propertyId}/{timestamp}-{index}.{ext}`

---

## Neue / geänderte Dateien

### `api/properties.js` (neu)
Vercel Serverless Function für CRUD-Operationen.
- `GET` → alle Properties aus Supabase lesen (ohne PIN)
- `POST` → neues Inserat erstellen (PIN-Prüfung erforderlich)
- `PUT` → Inserat aktualisieren (PIN-Prüfung erforderlich)
- `DELETE` → Inserat löschen (PIN-Prüfung erforderlich)

### `api/upload-image.js` (neu)
Vercel Serverless Function für Bild-Upload.
- Empfängt base64-Bild + PIN + propertyId
- Prüft PIN
- Lädt Bild zu Supabase Storage hoch
- Gibt öffentliche URL zurück

### `src/context/AdminContext.jsx` (geändert)
- `fetchProperties()` von Supabase direkt (via Anon-Key) statt aus `content.json`
- `deleteProperty(id)` → `DELETE /api/properties?id=...`
- `addProperty(prop)` → `POST /api/properties`
- `updateProperty(id, prop)` → `PUT /api/properties`
- `content.properties` wird durch separaten `properties`-State ersetzt

### `src/pages/AdminInseratePage.jsx` (geändert)
- Bild-Upload: erst zu `api/upload-image.js`, bekommt URL zurück
- Dann URL wird im Property gespeichert (kein base64 mehr im State)

### `api/save.js` (geändert)
- Properties-Teil entfernen (Properties laufen jetzt über `api/properties.js`)
- Nur noch `content.json`-Daten ohne Properties speichern

### `src/components/PropertyMarquee.jsx` (minimal geändert)
- Liest weiterhin aus `content.properties` (oder neuem Properties-State) — keine funktionale Änderung

### `src/pages/PropertiesPage.jsx` (minimal geändert)
- Liest weiterhin aus `content.properties` (oder neuem Properties-State) — keine funktionale Änderung

---

## Umgebungsvariablen

| Variable | Wo | Beschreibung |
|----------|-----|--------------|
| `VITE_SUPABASE_URL` | Vercel + `.env` lokal | Supabase Projekt-URL (öffentlich) |
| `VITE_SUPABASE_ANON_KEY` | Vercel + `.env` lokal | Anon/Public Key (öffentlich, sicher) |
| `SUPABASE_SERVICE_ROLE_KEY` | Nur Vercel | Service-Role-Key (geheim, nur Backend) |

---

## Migrations-Schritte (einmalig)

1. Supabase-Projekt erstellen (kostenlos)
2. Tabelle `properties` anlegen (SQL in Supabase Studio)
3. RLS aktivieren und Policy setzen
4. Bucket `property-images` erstellen (public)
5. Umgebungsvariablen in Vercel setzen
6. Code deployen
7. Bestehende Properties (falls vorhanden) manuell über Admin-UI neu eingeben

---

## Was sich NICHT ändert

- Admin-Login: `api/admin-login.js` bleibt unverändert
- Hero, Services, Testimonials, Farben: weiterhin in `content.json` / GitHub
- `api/save.js` bleibt für alles außer Properties
- Frontend-Routing und alle Seiten bleiben gleich
- Design und UI bleiben komplett gleich
