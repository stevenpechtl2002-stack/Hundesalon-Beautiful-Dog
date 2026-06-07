import { Link } from 'react-router-dom'

export default function AgbPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f5', paddingTop: 80, fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 40px' }}>
        <Link to="/" style={{ fontSize: 13, fontWeight: 700, color: '#999', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Zurück zur Startseite</Link>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 42, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Allgemeine Geschäftsbedingungen</h1>
        <p style={{ fontSize: 14, color: '#aaa', marginBottom: 48 }}>NordzypernImmo · Stand: Juni 2026</p>

        <Section title="§ 1 Geltungsbereich">
          <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen NordzypernImmo (nachfolgend „Makler") und dem Kunden über die Vermittlung von Immobilien in Nordzypern.</p>
        </Section>

        <Section title="§ 2 Leistungen des Maklers">
          <p>NordzypernImmo vermittelt Kauf- und Mietimmobilien in der Türkischen Republik Nordzypern. Der Makler ist als Vermittler tätig und wird sowohl für Käufer/Mieter als auch für Verkäufer/Vermieter tätig.</p>
          <p style={{ marginTop: 12 }}>Zu den Leistungen gehören:</p>
          <ul style={{ paddingLeft: 20, marginTop: 8 }}>
            <li>Präsentation von Immobilienangeboten</li>
            <li>Kontaktherstellung zwischen Käufer/Mieter und Verkäufer/Vermieter</li>
            <li>Besichtigungsorganisation</li>
            <li>Beratung und Unterstützung im Kaufprozess</li>
          </ul>
        </Section>

        <Section title="§ 3 Maklerprovision">
          <p>Bei erfolgreicher Vermittlung eines Kaufvertrages ist eine Maklerprovision in Höhe von 3 % des Kaufpreises zzgl. der gesetzlichen Umsatzsteuer fällig. Bei Mietvermittlung beträgt die Provision 2 Monatsnettokaltmieten zzgl. der gesetzlichen Umsatzsteuer.</p>
          <p style={{ marginTop: 12 }}>Die Provision wird fällig mit Abschluss des notariellen Kauf- bzw. Mietvertrages.</p>
        </Section>

        <Section title="§ 4 Pflichten des Kunden">
          <p>Der Kunde verpflichtet sich, alle für die Durchführung des Auftrags notwendigen Informationen wahrheitsgemäß und vollständig mitzuteilen. Der Kunde ist verpflichtet, dem Makler unverzüglich mitzuteilen, wenn ein anderweitiger Vertragsabschluss bevorsteht oder erfolgt ist.</p>
        </Section>

        <Section title="§ 5 Haftungsbeschränkung">
          <p>NordzypernImmo haftet nicht für die Richtigkeit der von Eigentümern oder Dritten übermittelten Informationen zu Immobilien (z. B. Grundbuchauszüge, Baupläne, Flächenangaben). Der Kunde ist gehalten, diese Angaben selbst zu überprüfen oder durch Fachleute überprüfen zu lassen.</p>
          <p style={{ marginTop: 12 }}>Eine Haftung für entgangenen Gewinn, mittelbare Schäden oder Folgeschäden ist ausgeschlossen, soweit gesetzlich zulässig.</p>
        </Section>

        <Section title="§ 6 Datenschutz">
          <p>Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung, die unter <Link to="/datenschutz" style={{ color: 'var(--site-btn, #1e1a16)' }}>/datenschutz</Link> abrufbar ist.</p>
        </Section>

        <Section title="§ 7 Widerrufsrecht">
          <p>Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Informationen zum Widerrufsrecht erhalten Sie auf Anfrage per E-Mail an info@nordzypernimmo.de.</p>
        </Section>

        <Section title="§ 8 Anwendbares Recht und Gerichtsstand">
          <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Köln, soweit der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches Sondervermögen ist.</p>
        </Section>

        <Section title="§ 9 Salvatorische Klausel">
          <p>Sollten einzelne Bestimmungen dieser AGB unwirksam oder undurchführbar sein oder werden, so bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.</p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/impressum" style={{ fontSize: 13, fontWeight: 700, color: '#aaa', textDecoration: 'none' }}>Impressum</Link>
            <Link to="/datenschutz" style={{ fontSize: 13, fontWeight: 700, color: '#aaa', textDecoration: 'none' }}>Datenschutz</Link>
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
