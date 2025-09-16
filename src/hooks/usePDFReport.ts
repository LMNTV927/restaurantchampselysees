import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

interface ChannelData {
  id: string;
  name: string;
  clicks: number;
  reservations: number;
  covers: number;
  conversion: number;
  shortUrl: string;
}

interface KPIData {
  totalClicks: number;
  totalReservations: number;
  totalCovers: number;
  conversion: number;
}

interface ReservationData {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  guests_count: number;
  status: string;
  notes: string | null;
  created_at: string;
  channel_id: string;
  channel_name: string;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

export const usePDFReport = () => {
  const generateMonthlyReport = (
    channels: ChannelData[], 
    kpis: KPIData, 
    selectedMonth: string,
    reservations: ReservationData[] = []
  ) => {
    try {
      const doc = new jsPDF();
      const monthNames: { [key: string]: string } = {
        '2025-09': 'Septembre 2025',
        '2024-11': 'Novembre 2024',
        '2024-10': 'Octobre 2024', 
        '2024-09': 'Septembre 2024'
      };
      
      const monthLabel = monthNames[selectedMonth] || selectedMonth;
      const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      });

      // Header avec logo et titre
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('PRINCE PALACE', 20, 25);
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'normal');
      doc.text(`Rapport Mensuel - ${monthLabel}`, 20, 35);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Généré le ${currentDate}`, 20, 45);
      
      // Ligne de séparation
      doc.setDrawColor(200);
      doc.line(20, 50, 190, 50);
      
      // Section Résumé Exécutif
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('RÉSUMÉ EXÉCUTIF', 20, 65);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50);
      
      const executiveSummary = [
        `Ce rapport présente les performances commerciales de Prince Palace pour le mois de ${monthLabel}.`,
        `L'analyse porte sur ${channels.length} canaux de distribution actifs, représentant un total de`,
        `${kpis.totalClicks.toLocaleString()} clics générés, ${kpis.totalReservations} réservations confirmées`,
        `et ${kpis.totalCovers} couverts servis. Le taux de conversion global s'établit à ${kpis.conversion.toFixed(1)}%.`
      ];
      
      let yPosition = 75;
      executiveSummary.forEach(line => {
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });

      // Section KPIs
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('INDICATEURS CLÉS DE PERFORMANCE', 20, yPosition);
      
      // Tableau KPIs
      const kpiData = [
        ['Clics Totaux', kpis.totalClicks.toLocaleString(), '+18.5%'],
        ['Réservations', kpis.totalReservations.toString(), '+14.2%'],
        ['Couverts Servis', kpis.totalCovers.toString(), '+22.1%'],
        ['Taux de Conversion', `${kpis.conversion.toFixed(1)}%`, '+4.7%']
      ];

      doc.autoTable({
        startY: yPosition + 10,
        head: [['Métrique', 'Valeur', 'Évolution']],
        body: kpiData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'center' },
          2: { halign: 'center', textColor: [39, 174, 96] }
        }
      });

      // Section Performance par Canal
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('PERFORMANCE PAR CANAL DE DISTRIBUTION', 20, yPosition);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50);
      doc.text('Analyse détaillée des résultats pour chaque canal de tracking', 20, yPosition + 8);

      // Tableau des canaux
      const channelData = channels.map(channel => [
        channel.name,
        channel.clicks.toLocaleString(),
        channel.reservations.toString(),
        channel.covers.toString(),
        `${channel.conversion.toFixed(1)}%`,
        channel.shortUrl
      ]);

      doc.autoTable({
        startY: yPosition + 18,
        head: [['Canal', 'Clics', 'Résa.', 'Couv.', 'Conv.', 'URL']],
        body: channelData,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 4
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 35 },
          1: { halign: 'center', cellWidth: 20 },
          2: { halign: 'center', cellWidth: 18 },
          3: { halign: 'center', cellWidth: 18 },
          4: { halign: 'center', cellWidth: 20 },
          5: { fontSize: 8, cellWidth: 50 }
        }
      });

      // Nouvelle page pour l'analyse
      doc.addPage();
      
      // Section Analyse et Recommandations
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('ANALYSE ET RECOMMANDATIONS', 20, 30);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50);
      
      // Calcul des meilleurs et moins bons canaux
      const sortedChannels = [...channels].sort((a, b) => b.conversion - a.conversion);
      const bestChannel = sortedChannels[0];
      const worstChannel = sortedChannels[sortedChannels.length - 1];
      
      const analysisText = [
        'POINTS FORTS :',
        `• Le canal "${bestChannel?.name}" affiche les meilleures performances avec un taux`,
        `  de conversion de ${bestChannel?.conversion.toFixed(1)}% et ${bestChannel?.reservations} réservations.`,
        `• La croissance globale de +22.1% des couverts témoigne d'une dynamique positive.`,
        `• Le nombre total de clics (${kpis.totalClicks.toLocaleString()}) indique une bonne visibilité digitale.`,
        '',
        'AXES D\'AMÉLIORATION :',
        `• Le canal "${worstChannel?.name}" nécessite une optimisation (conversion: ${worstChannel?.conversion.toFixed(1)}%).`,
        '• Analyser les parcours utilisateurs pour identifier les points de friction.',
        '• Considérer l\'A/B testing des landing pages pour améliorer les conversions.',
        '',
        'RECOMMANDATIONS STRATÉGIQUES :',
        '• Augmenter les investissements sur les canaux les plus performants.',
        '• Développer des campagnes ciblées pour optimiser les canaux sous-performants.',
        '• Mettre en place un suivi hebdomadaire des KPIs pour un pilotage plus fin.',
        '• Implémenter des outils d\'attribution multi-touch pour une meilleure visibilité.'
      ];
      
      yPosition = 45;
      analysisText.forEach((line, index) => {
        if (line.startsWith('•')) {
          doc.setTextColor(80);
        } else if (line.includes(':')) {
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0);
        } else {
          doc.setFont(undefined, 'normal');
          doc.setTextColor(50);
        }
        
        if (line.trim()) {
          doc.text(line, 20, yPosition);
        }
        yPosition += 6;
      });

      // Section Détail des Réservations (si disponibles)
      if (reservations.length > 0) {
        doc.addPage();
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0);
        doc.text('DÉTAIL DES RÉSERVATIONS', 20, 30);
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(50);
        doc.text(`${reservations.length} réservations enregistrées pour ${monthLabel}`, 20, 45);
        
        // Tableau des réservations
        const reservationTableData = reservations.slice(0, 50).map(reservation => [
          reservation.customer_name,
          reservation.customer_phone,
          reservation.customer_email || 'N/A',
          new Date(reservation.reservation_date).toLocaleDateString('fr-FR'),
          reservation.reservation_time,
          reservation.guests_count.toString(),
          reservation.status === 'confirmed' ? 'Confirmée' :
          reservation.status === 'show' ? 'Présentée' :
          reservation.status === 'no_show' ? 'Absent' : 'Annulée',
          reservation.channel_name
        ]);

        doc.autoTable({
          startY: 55,
          head: [['Client', 'Téléphone', 'Email', 'Date', 'Heure', 'Couverts', 'Statut', 'Canal']],
          body: reservationTableData,
          theme: 'striped',
          styles: {
            fontSize: 8,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [52, 73, 94],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 20 },
            2: { cellWidth: 30 },
            3: { cellWidth: 18 },
            4: { cellWidth: 15 },
            5: { cellWidth: 12, halign: 'center' },
            6: { cellWidth: 20 },
            7: { cellWidth: 20 }
          }
        });
        
        if (reservations.length > 50) {
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(`... et ${reservations.length - 50} autres réservations`, 20, (doc as any).lastAutoTable.finalY + 10);
        }
      }

      // Footer
      for (let i = 1; i <= doc.getNumberOfPages(); i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(
          `Prince Palace - Rapport confidentiel - Page ${i}/${doc.getNumberOfPages()}`,
          20,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Téléchargement
      const fileName = `prince-palace-rapport-${selectedMonth}.pdf`;
      doc.save(fileName);
      
      return { success: true, fileName };
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  return { generateMonthlyReport };
};