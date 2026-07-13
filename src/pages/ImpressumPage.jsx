import { Link } from 'react-router-dom'

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f5', paddingTop: 80, fontFamily: 'Nunito, sans-serif' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '48px 40px' }}>
        <Link to="/" style={{ fontSize: 13, fontWeight: 700, color: '#999', textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>← Zurück zur Startseite</Link>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 42, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Impressum</h1>
        <p style={{ fontSize: 14, color: '#aaa', marginBottom: 48 }}>Angaben gemäß § 5 TMG</p>

        <Section title="Angaben zum Unternehmen">
          <p><strong>NordzypernImmo</strong></p>
          <p>Andreas Pechtl</p>
          <p>Drosselweg 11</p>
          <p>75175 Pforzheim</p>
          <p>Deutschland</p>
        </Section>

        <Section title="Kontakt">
          <p>Telefon: +49 152 51946226</p>
          <p>E-Mail: andreas.pechtl@nord-zypern-immo.com</p>
          <p>Website: www.nord-zypern-immo.com</p>
        </Section>

        <Section title="Berufsbezeichnung und berufsrechtliche Regelungen">
          <p>Berufsbezeichnung: Immobilienmakler</p>
          <p>Zuständige Aufsichtsbehörde: IHK Nordschwarzwald</p>
          <p>Erlaubnisinhaber gemäß § 34c GewO</p>
        </Section>

        <Section title="Haftung für Inhalte">
          <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
          <p style={{ marginTop: 12 }}>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>
        </Section>

        <Section title="Haftung für Links">
          <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
        </Section>

        <Section title="Urheberrecht">
          <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
        </Section>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link to="/datenschutz" style={{ fontSize: 13, fontWeight: 700, color: '#aaa', textDecoration: 'none' }}>Datenschutz</Link>
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
