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
}: ReservationConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre réservation chez {restaurantName} est confirmée</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://rkkxsuyauwduexiutgkr.supabase.co/storage/v1/object/public/restaurant-assets/prince-palace-logo.png"
            width="120"
            height="120"
            alt={`Logo ${restaurantName}`}
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Réservation Confirmée ✓</Heading>
        
        <Text style={text}>
          Bonjour <strong>{customerName}</strong>,
        </Text>
        
        <Text style={text}>
          Nous sommes ravis de confirmer votre réservation chez <strong>{restaurantName}</strong>.
        </Text>

        <Section style={reservationBox}>
          <Heading style={h2}>Détails de votre réservation</Heading>
          
          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>📅 Date :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{reservationDate}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>🕐 Heure :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{reservationTime}</Text>
            </Column>
          </Row>

          <Row style={detailRow}>
            <Column style={labelColumn}>
              <Text style={label}>👥 Nombre de personnes :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={value}>{guestsCount} personne{guestsCount > 1 ? 's' : ''}</Text>
            </Column>
          </Row>

          {customerPhone && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>📞 Téléphone :</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{customerPhone}</Text>
              </Column>
            </Row>
          )}

          {notes && (
            <Row style={detailRow}>
              <Column style={labelColumn}>
                <Text style={label}>📝 Notes :</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={value}>{notes}</Text>
              </Column>
            </Row>
          )}
        </Section>

        <Hr style={hr} />

        <Section style={infoSection}>
          <Text style={infoText}>
            <strong>Informations importantes :</strong>
          </Text>
          <Text style={infoText}>
            • Merci d'arriver à l'heure pour profiter pleinement de votre expérience
          </Text>
          <Text style={infoText}>
            • En cas d'empêchement, contactez-nous au moins 2 heures à l'avance
          </Text>
          <Text style={infoText}>
            • Nous nous réjouissons de vous accueillir !
          </Text>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Merci de votre confiance,<br />
          L'équipe de <strong>{restaurantName}</strong>
        </Text>
      </Container>
    </Body>
  </Html>
);

export default ReservationConfirmationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoContainer = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const logo = {
  margin: '0 auto',
  borderRadius: '8px',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  padding: '0',
};

const text = {
  color: '#1a1a1a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '0 40px',
};

const reservationBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '32px 40px',
  padding: '24px',
};

const detailRow = {
  marginBottom: '12px',
};

const labelColumn = {
  width: '40%',
  verticalAlign: 'top' as const,
};

const valueColumn = {
  width: '60%',
  verticalAlign: 'top' as const,
};

const label = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  padding: '0',
};

const value = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  padding: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
};

const infoSection = {
  margin: '0 40px',
};

const infoText = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
  padding: '0',
};

const footer = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  lineHeight: '24px',
  margin: '32px 0 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};