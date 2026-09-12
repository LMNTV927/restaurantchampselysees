import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ReservationConfirmationEmailProps {
  customerName: string;
  restaurantName: string;
  reservationDate: string;
  reservationTime: string;
  guestsCount: number;
  customerPhone?: string;
  notes?: string;
  modificationToken?: string;
  emailType?: 'confirmation' | 'modification' | 'cancellation';
}

const BASE_URL = 'https://restaurantchampselysees.fr';

export const ReservationConfirmationEmail = ({
  customerName,
  restaurantName,
  reservationDate,
  reservationTime,
  guestsCount,
  customerPhone,
  notes,
  modificationToken,
  emailType = 'confirmation',
}: ReservationConfirmationEmailProps) => {
  const calendarTitle = encodeURIComponent(`Réservation ${restaurantName}`);
  const calendarLocation = encodeURIComponent('76 Av. des Champs-Élysées, 75008 Paris');
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&location=${calendarLocation}`;
  const logoUrl = 'https://vedistbhwfdtkjaojycs.supabase.co/storage/v1/object/public/email-assets/prince-palace-logo-email.png';

  const modifyUrl = modificationToken ? `${BASE_URL}/reservation/modify/${modificationToken}` : '#';
  const cancelUrl = modificationToken ? `${BASE_URL}/reservation/cancel/${modificationToken}` : '#';

  const isCancellation = emailType === 'cancellation';
  const isModification = emailType === 'modification';

  const headingText = isCancellation
    ? 'Réservation annulée'
    : isModification
      ? 'Réservation modifiée'
      : 'Réservation confirmée';

  const subtitleText = isCancellation
    ? `${customerName}, votre réservation a été annulée.`
    : isModification
      ? `${customerName}, votre réservation a été mise à jour.`
      : `Merci ${customerName}, on vous attend !`;

  const previewText = isCancellation
    ? `Votre réservation chez ${restaurantName} a été annulée`
    : isModification
      ? `Votre réservation chez ${restaurantName} a été modifiée ✓`
      : `Votre réservation chez ${restaurantName} est confirmée ✓`;

  const checkIcon = isCancellation ? '✗' : '✓';
  const checkColor = isCancellation ? '#ef4444' : '#c9a84c';
  const checkBg = isCancellation ? 'rgba(239,68,68,0.1)' : 'rgba(201,168,76,0.1)';
  const checkBorder = isCancellation ? 'rgba(239,68,68,0.25)' : 'rgba(201,168,76,0.25)';

  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={wrap}>
          {/* Logo */}
          <table cellPadding="0" cellSpacing="0" width="100%" style={topbar}>
            <tr>
              <td align="center">
                <Img src={logoUrl} width="280" alt={restaurantName} />
              </td>
            </tr>
          </table>

          {/* Success / Status */}
          <table cellPadding="0" cellSpacing="0" width="100%" style={successSection}>
            <tr>
              <td align="center" style={{ paddingBottom: '14px' }}>
                <table cellPadding="0" cellSpacing="0"><tr><td align="center" style={{ ...checkCircle, backgroundColor: checkBg, border: `1px solid ${checkBorder}` }}>
                  <span style={{ fontSize: '22px', color: checkColor, lineHeight: '48px' }}>{checkIcon}</span>
                </td></tr></table>
              </td>
            </tr>
            <tr>
              <td align="center">
                <Heading style={h1}>{headingText}</Heading>
              </td>
            </tr>
            <tr>
              <td align="center">
                <Text style={subtitle}>{subtitleText}</Text>
              </td>
            </tr>
          </table>

          {/* Details */}
          <table cellPadding="0" cellSpacing="0" width="100%" style={card}>
            <tr><td align="center" style={detailRow}>
              <Text style={label}>Date</Text>
              <Text style={{ ...value, textDecoration: isCancellation ? 'line-through' : 'none' }}>{reservationDate}</Text>
            </td></tr>
            <tr><td align="center" style={detailRow}>
              <Text style={label}>Heure</Text>
              <Text style={{ ...value, textDecoration: isCancellation ? 'line-through' : 'none' }}>{reservationTime}</Text>
            </td></tr>
            <tr><td align="center" style={detailRow}>
              <Text style={label}>Couverts</Text>
              <Text style={{ ...value, textDecoration: isCancellation ? 'line-through' : 'none' }}>{guestsCount} personne{guestsCount > 1 ? 's' : ''}</Text>
            </td></tr>
            {notes && (
              <tr><td align="center" style={{ ...detailRow, borderBottom: 'none' }}>
                <Text style={label}>Notes</Text>
                <Text style={value}>{notes}</Text>
              </td></tr>
            )}
          </table>

          {/* Buttons - only show for confirmation/modification */}
          {!isCancellation && (
            <table cellPadding="0" cellSpacing="0" width="100%" style={actionsSection}>
              <tr><td align="center" style={{ paddingBottom: '10px' }}>
                <Link href={calendarUrl} style={{ ...btn, ...btnGold, display: 'inline-block' as const, width: 'auto', padding: '12px 32px', fontSize: '13px' }}>
                  Ajouter au calendrier
                </Link>
              </td></tr>
              <tr><td align="center">
                <table
                  cellPadding="0"
                  cellSpacing="0"
                  width="100%"
                  style={{ borderCollapse: 'separate' as const, borderSpacing: '0', tableLayout: 'fixed' as const }}
                >
                  <tr>
                    <td width="50%" align="center" style={{ padding: '0 8px 0 0' }}>
                      <Link href={modifyUrl} style={{ ...btn, ...btnOutline, display: 'inline-block' as const, width: '92%', maxWidth: '220px', padding: '12px 10px', fontSize: '13px' }}>Modifier</Link>
                    </td>
                    <td width="50%" align="center" style={{ padding: '0 0 0 8px' }}>
                      <Link href={cancelUrl} style={{ ...btn, ...btnOutline, display: 'inline-block' as const, width: '92%', maxWidth: '220px', padding: '12px 10px', fontSize: '13px' }}>Annuler</Link>
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>
          )}

          {/* Location */}
          <table cellPadding="0" cellSpacing="0" width="100%" style={locSection}>
            <tr><td align="center">
              <table cellPadding="0" cellSpacing="0" width="100%" style={locInner}>
                <tr><td align="center" style={{ paddingBottom: '8px' }}>
                  <table cellPadding="0" cellSpacing="0"><tr><td align="center" style={locPin}>
                    <span style={{ fontSize: '16px', color: '#c9a84c', lineHeight: '36px' }}>📍</span>
                  </td></tr></table>
                </td></tr>
                <tr><td align="center">
                  <Text style={locTitle}>Prince Palace</Text>
                </td></tr>
                <tr><td align="center">
                  <Text style={locAddress}>76 Av. des Champs-Élysées, 75008 Paris</Text>
                  <Text style={locAddress}>59 Rue de Ponthieu, 75008 Paris</Text>
                </td></tr>
                <tr><td align="center" style={{ paddingTop: '8px' }}>
                  <Link href="tel:0159133268" style={locPhone}>01 59 13 32 68</Link>
                </td></tr>
              </table>
            </td></tr>
          </table>

          {/* Footer */}
          <table cellPadding="0" cellSpacing="0" width="100%" style={footer}>
            <tr><td align="center" style={{ paddingBottom: '16px' }}>
              <Link href="https://www.instagram.com/princepalace_off/" style={socialLink}>
                <Img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="20" height="20" alt="Instagram" style={{ opacity: 0.5 }} />
              </Link>
              &nbsp;&nbsp;&nbsp;
              <Link href="https://www.facebook.com/leprincepalace75" style={socialLink}>
                <Img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width="20" height="20" alt="Facebook" style={{ opacity: 0.5 }} />
              </Link>
              &nbsp;&nbsp;&nbsp;
              <Link href="https://www.tiktok.com/@59princepalace" style={socialLink}>
                <Img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" height="20" alt="TikTok" style={{ opacity: 0.5 }} />
              </Link>
            </td></tr>
            <tr><td align="center">
              <Text style={legalText}>
                <Link href="https://princepalace.fr" style={legalLink}>princepalace.fr</Link>
              </Text>
              <Text style={legalText}>
                <Link href="#" style={legalLink}>Se désabonner</Link> · <Link href="#" style={legalLink}>Confidentialité</Link>
              </Text>
            </td></tr>
          </table>
        </Container>
      </Body>
    </Html>
  );
};

export default ReservationConfirmationEmail;

// — Styles —

const main = {
  backgroundColor: '#0a0908',
  fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
  padding: '24px 16px',
};

const wrap = {
  maxWidth: '720px',
  margin: '0 auto',
};

const topbar = {
  backgroundColor: '#0d0b09',
  padding: '36px 28px',
  borderRadius: '16px 16px 0 0',
  border: '1px solid rgba(201,168,76,0.12)',
  borderBottom: 'none',
};

const successSection = {
  backgroundColor: '#111111',
  padding: '28px 28px 24px',
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
  borderBottom: '1px solid rgba(201,168,76,0.08)',
};

const checkCircle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: 'rgba(201,168,76,0.1)',
  border: '1px solid rgba(201,168,76,0.25)',
  textAlign: 'center' as const,
};

const h1 = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#f2ede4',
  margin: '0 0 4px',
};

const subtitle = {
  fontSize: '13.5px',
  color: '#7a7268',
  fontWeight: '400' as const,
  margin: '0',
};

const card = {
  backgroundColor: '#111111',
  padding: '0 28px',
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
};

const detailRow = {
  padding: '16px 0',
  borderBottom: '1px solid rgba(201,168,76,0.08)',
};

const label = {
  fontSize: '12px',
  color: '#7a7268',
  fontWeight: '400' as const,
  margin: '0 0 4px',
  textAlign: 'center' as const,
};

const value = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#f2ede4',
  margin: '0',
  textAlign: 'center' as const,
};

const actionsSection = {
  backgroundColor: '#111111',
  padding: '20px 28px 28px',
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
  borderBottom: '1px solid rgba(201,168,76,0.08)',
};

const btn = {
  display: 'inline-block' as const,
  width: '100%',
  padding: '14px',
  boxSizing: 'border-box' as const,
  textAlign: 'center' as const,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  fontWeight: '600',
  borderRadius: '10px',
  textDecoration: 'none' as const,
};

const btnGold = {
  backgroundColor: '#c9a84c',
  color: '#0d0b09',
};

const btnOutline = {
  backgroundColor: 'transparent',
  color: '#c9a84c',
  border: '1.5px solid rgba(201,168,76,0.25)',
};

const locSection = {
  backgroundColor: '#111111',
  padding: '20px 28px 24px',
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
  borderBottom: '1px solid rgba(201,168,76,0.08)',
};

const locInner = {
  backgroundColor: 'rgba(201,168,76,0.04)',
  border: '1px solid rgba(201,168,76,0.1)',
  borderRadius: '10px',
  padding: '18px',
};

const locPin = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'rgba(201,168,76,0.08)',
  border: '1px solid rgba(201,168,76,0.15)',
  textAlign: 'center' as const,
};

const locTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#f2ede4',
  margin: '0 0 4px',
};

const locAddress = {
  fontSize: '12.5px',
  color: '#7a7268',
  lineHeight: '1.6',
  margin: '0',
};

const locPhone = {
  color: '#c9a84c',
  fontWeight: '500' as const,
  textDecoration: 'none' as const,
  fontSize: '13px',
};

const footer = {
  backgroundColor: '#0d0b09',
  padding: '24px 28px',
  borderRadius: '0 0 16px 16px',
  border: '1px solid rgba(201,168,76,0.12)',
  borderTop: 'none',
};

const socialLink = {
  display: 'inline-block' as const,
  textDecoration: 'none' as const,
};

const legalText = {
  fontSize: '11px',
  color: '#4a4440',
  lineHeight: '1.8',
  margin: '0',
};

const legalLink = {
  color: '#7a7268',
  textDecoration: 'underline' as const,
  textUnderlineOffset: '2px',
};

const disclaimerSection = {
  backgroundColor: '#111111',
  padding: '0 28px 18px',
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
  borderBottom: '1px solid rgba(201,168,76,0.08)',
};

const disclaimerText = {
  fontSize: '10.5px',
  color: '#7a7268',
  lineHeight: '1.5',
  fontStyle: 'italic' as const,
  margin: '0',
  textAlign: 'center' as const,
};
