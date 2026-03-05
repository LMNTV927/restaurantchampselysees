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
  Hr,
  Row,
  Column,
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
}

export const ReservationConfirmationEmail = ({
  customerName,
  restaurantName,
  reservationDate,
  reservationTime,
  guestsCount,
  customerPhone,
  notes,
}: ReservationConfirmationEmailProps) => {
  // Build Google Calendar link
  const calendarTitle = encodeURIComponent(`Réservation ${restaurantName}`);
  const calendarLocation = encodeURIComponent('76 Av. des Champs-Élysées, 75008 Paris');
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&location=${calendarLocation}`;

  return (
    <Html>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Preview>Votre réservation chez {restaurantName} est confirmée ✓</Preview>
      <Body style={main}>
        <Container style={wrap}>
          {/* Top bar with logo */}
          <Section style={topbar}>
            <Img
              src="https://rkkxsuyauwduexiutgkr.supabase.co/storage/v1/object/public/restaurant-assets/prince-palace-logo.png"
              width="220"
              alt={restaurantName}
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Success section */}
          <Section style={successSection}>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td align="center">
                  <div style={checkCircle}>
                    <span style={{ fontSize: '22px', color: '#c9a84c' }}>✓</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Heading style={h1}>Réservation confirmée</Heading>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Text style={subtitle}>Merci {customerName}, on vous attend !</Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Reservation details */}
          <Section style={card}>
            <div style={detailRow}>
              <Text style={label}>Date</Text>
              <Text style={value}>{reservationDate}</Text>
            </div>
            <div style={detailRow}>
              <Text style={label}>Heure</Text>
              <Text style={value}>{reservationTime}</Text>
            </div>
            <div style={{ ...detailRow, borderBottom: 'none' }}>
              <Text style={label}>Couverts</Text>
              <Text style={value}>{guestsCount} personne{guestsCount > 1 ? 's' : ''}</Text>
            </div>
            {notes && (
              <div style={detailRow}>
                <Text style={label}>Notes</Text>
                <Text style={value}>{notes}</Text>
              </div>
            )}
          </Section>

          {/* Action buttons */}
          <Section style={actionsSection}>
            <Link href={calendarUrl} style={{ ...btn, ...btnGold, display: 'block', textDecoration: 'none' }}>
              Ajouter au calendrier
            </Link>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td style={{ width: '48%' }}>
                  <Link href="tel:0159133268" style={{ ...btn, ...btnOutline, display: 'block', textDecoration: 'none' }}>
                    Modifier
                  </Link>
                </td>
                <td style={{ width: '4%' }}></td>
                <td style={{ width: '48%' }}>
                  <Link href="tel:0159133268" style={{ ...btn, ...btnOutline, display: 'block', textDecoration: 'none' }}>
                    Annuler
                  </Link>
                </td>
              </tr>
            </table>
          </Section>

          {/* Location section */}
          <Section style={locSection}>
            <div style={locInner}>
              <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                <tr>
                  <td align="center">
                    <div style={locPin}>
                      <span style={{ fontSize: '16px', color: '#c9a84c' }}>📍</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <Text style={locTitle}>Prince Palace</Text>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <Text style={locAddress}>76 Av. des Champs-Élysées, 75008 Paris</Text>
                    <Text style={locAddress}>59 Rue de Ponthieu, 75008 Paris</Text>
                  </td>
                </tr>
                <tr>
                  <td align="center" style={{ paddingTop: '8px' }}>
                    <Link href="tel:0159133268" style={locPhone}>01 59 13 32 68</Link>
                  </td>
                </tr>
              </table>
            </div>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td align="center" style={{ paddingBottom: '16px' }}>
                  <Link href="https://instagram.com/princepalace.paris" style={socialLink}>
                    <Img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="20" height="20" alt="Instagram" style={{ opacity: 0.5 }} />
                  </Link>
                  &nbsp;&nbsp;&nbsp;
                  <Link href="https://facebook.com/princepalaceparis" style={socialLink}>
                    <Img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width="20" height="20" alt="Facebook" style={{ opacity: 0.5 }} />
                  </Link>
                  &nbsp;&nbsp;&nbsp;
                  <Link href="https://tiktok.com/@princepalaceparis" style={socialLink}>
                    <Img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" width="20" height="20" alt="TikTok" style={{ opacity: 0.5 }} />
                  </Link>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <Text style={legalText}>
                    <Link href="https://princepalace.fr" style={legalLink}>princepalace.fr</Link>
                  </Text>
                  <Text style={legalText}>
                    <Link href="#" style={legalLink}>Se désabonner</Link> · <Link href="#" style={legalLink}>Confidentialité</Link>
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
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
  textAlign: 'center' as const,
  borderRadius: '16px 16px 0 0',
  border: '1px solid rgba(201,168,76,0.12)',
  borderBottom: 'none',
};

const successSection = {
  backgroundColor: '#111111',
  padding: '28px 28px 24px',
  textAlign: 'center' as const,
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
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginBottom: '14px',
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
  padding: '8px 28px',
  textAlign: 'center' as const,
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
};

const detailRow = {
  padding: '16px 0',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const label = {
  fontSize: '12px',
  color: '#7a7268',
  fontWeight: '400' as const,
  margin: '0 0 4px',
};

const value = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#f2ede4',
  margin: '0',
};

const actionsSection = {
  backgroundColor: '#111111',
  padding: '20px 28px 28px',
  borderLeft: '1px solid rgba(201,168,76,0.12)',
  borderRight: '1px solid rgba(201,168,76,0.12)',
  borderBottom: '1px solid rgba(201,168,76,0.08)',
};

const btn = {
  width: '100%',
  padding: '14px',
  textAlign: 'center' as const,
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  fontWeight: '600',
  borderRadius: '10px',
  border: 'none',
};

const btnGold = {
  backgroundColor: '#c9a84c',
  color: '#0d0b09',
  marginBottom: '10px',
};

const btnOutline = {
  backgroundColor: 'transparent',
  color: '#c9a84c',
  border: '1.5px solid rgba(201,168,76,0.25)',
};

const locSection = {
  backgroundColor: '#111111',
  padding: '20px 28px 24px',
  textAlign: 'center' as const,
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
  display: 'inline-flex' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginBottom: '8px',
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
  textAlign: 'center' as const,
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
