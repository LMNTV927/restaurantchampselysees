const EmailPreviewPage = () => {
  const logoUrl = 'https://vedistbhwfdtkjaojycs.supabase.co/storage/v1/object/public/email-assets/prince-palace-logo-email.png';
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Réservation Prince Palace')}&location=${encodeURIComponent('76 Av. des Champs-Élysées, 75008 Paris')}`;

  return (
    <div style={{ backgroundColor: '#0a0908', minHeight: '100vh', padding: '24px 16px', fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Logo */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#0d0b09', padding: '36px 28px', borderRadius: '16px 16px 0 0', border: '1px solid rgba(201,168,76,0.12)', borderBottom: 'none' }}>
          <tbody><tr><td align="center">
            <img src={logoUrl} width={280} alt="Prince Palace" />
          </td></tr></tbody>
        </table>

        {/* Success */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#111111', padding: '28px 28px 24px', borderLeft: '1px solid rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <tbody>
            <tr><td align="center" style={{ paddingBottom: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                <span style={{ fontSize: 22, color: '#c9a84c' }}>✓</span>
              </div>
            </td></tr>
            <tr><td align="center">
              <h1 style={{ fontSize: 20, fontWeight: 600, color: '#f2ede4', margin: '0 0 4px' }}>Réservation confirmée</h1>
            </td></tr>
            <tr><td align="center">
              <p style={{ fontSize: 13.5, color: '#7a7268', fontWeight: 400, margin: 0 }}>Merci Jean Dupont, on vous attend !</p>
            </td></tr>
          </tbody>
        </table>

        {/* Details */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#111111', padding: '0 28px', borderLeft: '1px solid rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.12)' }}>
          <tbody>
            {[
              { label: 'Date', value: 'Vendredi 7 mars 2026' },
              { label: 'Heure', value: '20:30' },
              { label: 'Durée', value: 'Créneau de 3 heures' },
              { label: 'Couverts', value: '4 personnes' },
            ].map((item, i) => (
              <tr key={i}><td align="center" style={{ padding: '16px 0', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
                <p style={{ fontSize: 12, color: '#7a7268', fontWeight: 400, margin: '0 0 4px', textAlign: 'center' }}>{item.label}</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: '#f2ede4', margin: 0, textAlign: 'center' }}>{item.value}</p>
              </td></tr>
            ))}
            <tr><td align="center" style={{ padding: '16px 0', borderBottom: 'none' }}>
              <p style={{ fontSize: 12, color: '#7a7268', fontWeight: 400, margin: '0 0 4px', textAlign: 'center' }}>Notes</p>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#f2ede4', margin: 0, textAlign: 'center' }}>Anniversaire, table près de la fenêtre si possible</p>
            </td></tr>
          </tbody>
        </table>

        {/* Buttons */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#111111', padding: '20px 28px 28px', borderLeft: '1px solid rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <tbody>
            <tr><td align="center" style={{ paddingBottom: 10 }}>
              <a href={calendarUrl} style={{ display: 'block', width: '100%', padding: 14, boxSizing: 'border-box' as const, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, borderRadius: 10, textDecoration: 'none', backgroundColor: '#c9a84c', color: '#0d0b09' }}>
                Ajouter au calendrier
              </a>
            </td></tr>
            <tr><td align="center">
              <table cellPadding={0} cellSpacing={0} width="100%" style={{ borderCollapse: 'separate', borderSpacing: 0, tableLayout: 'fixed' }}>
                <tbody><tr>
                  <td width="50%" align="center" style={{ padding: '0 8px 0 0' }}>
                    <a href="#" style={{ display: 'inline-block', width: '92%', maxWidth: 220, padding: '12px 10px', boxSizing: 'border-box' as const, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, borderRadius: 10, textDecoration: 'none', backgroundColor: 'transparent', color: '#c9a84c', border: '1.5px solid rgba(201,168,76,0.25)' }}>
                      Modifier
                    </a>
                  </td>
                  <td width="50%" align="center" style={{ padding: '0 0 0 8px' }}>
                    <a href="#" style={{ display: 'inline-block', width: '92%', maxWidth: 220, padding: '12px 10px', boxSizing: 'border-box' as const, textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, borderRadius: 10, textDecoration: 'none', backgroundColor: 'transparent', color: '#c9a84c', border: '1.5px solid rgba(201,168,76,0.25)' }}>
                      Annuler
                    </a>
                  </td>
                </tr></tbody>
              </table>
            </td></tr>
          </tbody>
        </table>

        {/* Location */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#111111', padding: '20px 28px 24px', borderLeft: '1px solid rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <tbody><tr><td align="center">
            <div style={{ backgroundColor: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 10, padding: 18, textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <span style={{ fontSize: 16, color: '#c9a84c' }}>📍</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#f2ede4', margin: '0 0 4px' }}>Prince Palace</p>
              <p style={{ fontSize: 12.5, color: '#7a7268', lineHeight: 1.6, margin: 0 }}>76 Av. des Champs-Élysées, 75008 Paris</p>
              <p style={{ fontSize: 12.5, color: '#7a7268', lineHeight: 1.6, margin: 0 }}>59 Rue de Ponthieu, 75008 Paris</p>
              <a href="tel:0159133268" style={{ color: '#c9a84c', fontWeight: 500, textDecoration: 'none', fontSize: 13, marginTop: 8, display: 'inline-block' }}>01 59 13 32 68</a>
            </div>
          </td></tr></tbody>
        </table>

        {/* Infos horaires & club */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#111111', padding: '0 28px 18px', borderLeft: '1px solid rgba(201,168,76,0.12)', borderRight: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
          <tbody><tr><td align="center" style={{ paddingTop: 16 }}>
            <p style={{ fontSize: 11.5, color: '#7a7268', lineHeight: 1.7, margin: '0 0 6px', textAlign: 'center' }}>🕐 Restauration : Lundi–Mercredi 17h00–00h00 · Jeudi–Dimanche 17h00–05h00</p>
            <p style={{ fontSize: 11.5, color: '#7a7268', lineHeight: 1.7, margin: '0 0 6px', textAlign: 'center' }}>🎭 Le club ouvre à partir de 1h du matin.</p>
            <p style={{ fontSize: 11.5, color: '#7a7268', lineHeight: 1.7, margin: 0, textAlign: 'center' }}>La réservation ne donne pas accès automatiquement à la partie club.</p>
          </td></tr></tbody>
        </table>

        {/* Footer */}
        <table cellPadding={0} cellSpacing={0} width="100%" style={{ backgroundColor: '#0d0b09', padding: '24px 28px', borderRadius: '0 0 16px 16px', border: '1px solid rgba(201,168,76,0.12)', borderTop: 'none' }}>
          <tbody>
            <tr><td align="center" style={{ paddingBottom: 16 }}>
              <a href="https://www.instagram.com/princepalace_off/" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width={20} height={20} alt="Instagram" style={{ opacity: 0.5 }} />
              </a>
              &nbsp;&nbsp;&nbsp;
              <a href="https://www.facebook.com/leprincepalace75" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width={20} height={20} alt="Facebook" style={{ opacity: 0.5 }} />
              </a>
              &nbsp;&nbsp;&nbsp;
              <a href="https://www.tiktok.com/@59princepalace" style={{ display: 'inline-block', textDecoration: 'none' }}>
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width={20} height={20} alt="TikTok" style={{ opacity: 0.5 }} />
              </a>
            </td></tr>
            <tr><td align="center">
              <p style={{ fontSize: 11, color: '#4a4440', lineHeight: 1.8, margin: 0 }}>
                <a href="https://princepalace.fr" style={{ color: '#7a7268', textDecoration: 'underline', textUnderlineOffset: 2 }}>princepalace.fr</a>
              </p>
              <p style={{ fontSize: 11, color: '#4a4440', lineHeight: 1.8, margin: 0 }}>
                <a href="#" style={{ color: '#7a7268', textDecoration: 'underline', textUnderlineOffset: 2 }}>Se désabonner</a> · <a href="#" style={{ color: '#7a7268', textDecoration: 'underline', textUnderlineOffset: 2 }}>Confidentialité</a>
              </p>
            </td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailPreviewPage;
