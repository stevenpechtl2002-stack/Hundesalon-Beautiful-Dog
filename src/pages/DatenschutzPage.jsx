import { Link } from 'react-router-dom'

export default function DatenschutzPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f5', paddingTop: 80, fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 40px' }}>
        <Link to="/" style={{ fontSize: 13, fontWeight: 700, color: '#999', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Zurück zur Startseite</Link>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 42, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Datenschutzerklärung</h1>
        <p style={{ fontSize: 14, color: '#aaa', marginBottom: 48 }}>Zuletzt aktualisiert: Juni 2026</p>

        <Section title="1. Datenschutz auf einen Blick">
          <p><strong>Allgemeine Hinweise</strong></p>
          <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
        </Section>

        <Section title="2. Datenerfassung auf dieser Website">
          <p><strong>Wer ist verantwortlich für die Datenerfassung?</strong></p>
          <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

          <p style={{ marginTop: 16 }}><strong>Wie erfassen wir Ihre Daten?</strong></p>
          <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen — z. B. durch das Kontaktformular. Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).</p>

          <p style={{ marginTop: 16 }}><strong>Wofür nutzen wir Ihre Daten?</strong></p>
          <p>Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.</p>
        </Section>

        <Section title="3. Hosting">
          <p>Diese Website wird bei Vercel gehostet. Anbieter ist die Vercel Inc., 340 Pine Street Suite 701, San Francisco, California 94104, USA.</p>
          <p style={{ marginTop: 12 }}>Details entnehmen Sie der Datenschutzerklärung von Vercel: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--site-btn, #1e1a16)' }}>https://vercel.com/legal/privacy-policy</a></p>
        </Section>

        <Section title="4. Kontaktformular">
          <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
          <p style={{ marginTop: 12 }}>Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist.</p>
        </Section>

        <Section title="5. Ihre Rechte">
          <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem das Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.</p>
          <p style={{ marginTop: 12 }}>Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.</p>
          <p style={{ marginTop: 12 }}>Wenn Sie Fragen zum Datenschutz haben, wenden Sie sich bitte an: <strong>info@nordzypernimmo.de</strong></p>
        </Section>

        <Section title="6. Analyse-Tools und Werbung">
          <p>Diese Website verwendet keine Tracking- oder Analyse-Tools von Drittanbietern (z. B. Google Analytics).</p>
        </Section>

        <Section title="7. Plugins und Tools">
          <p><strong>Google Fonts</strong></p>
          <p>Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten sogenannte Google Fonts, die von Google bereitgestellt werden. Beim Aufruf einer Seite lädt Ihr Browser die benötigten Fonts in ihren Browsercache, um Texte und Schriftarten korrekt anzuzeigen.</p>
          <p style={{ marginTop: 12 }}>Die Nutzung von Google Fonts erfolgt im Interesse einer einheitlichen und ansprechenden Darstellung unserer Online-Angebote. Weitere Informationen zu Google Fonts finden Sie unter <a href="https://developers.google.com/fonts/faq" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--site-btn, #1e1a16)' }}>https://developers.google.com/fonts/faq</a>.</p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/impressum" style={{ fontSize: 13, fontWeight: 700, color: '#aaa', textDecoration: 'none' }}>Impressum</Link>
            <Link to="/agb" style={{ fontSize: 13, fontWeight: 700, color: '#aaa', textDecoration: 'none' }}>AGB</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 15, color: '#555', lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}
