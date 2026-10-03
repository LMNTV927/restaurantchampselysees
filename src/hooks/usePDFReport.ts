import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  evolution?: {
    clicksEvolution: number | null;
    reservationsEvolution: number | null;
    coversEvolution: number | null;
    conversionEvolution: number | null;
  };
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


export const formatMonthLabel = (monthValue: string): string => {
  const [year, month] = monthValue.split('-').map(Number);
  if (!year || !month) return monthValue;
  const name = new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    timeZone: 'Europe/Paris',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
};

export interface PeriodMonthData {
  month: string;
  label: string;
  channels: ChannelData[];
  kpis: KPIData;
  reservations: ReservationData[];
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
      const monthLabel = formatMonthLabel(selectedMonth);
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

      // Calcul des données effectives (réservations présentées)
      const effectiveReservations = reservations.filter(r => r.status === 'show');
      const effectiveCovers = effectiveReservations.reduce((sum, r) => sum + r.guests_count, 0);

      // Section KPIs avec vraies évolutions
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('INDICATEURS CLÉS DE PERFORMANCE', 20, yPosition);
      
      const formatEvolution = (evolution: number | null): string => {
        if (evolution === null) return 'N/A';
        const sign = evolution >= 0 ? '+' : '';
        return `${sign}${evolution.toFixed(1)}%`;
      };
      
      // Tableau KPIs avec vraies évolutions
      const kpiData = [
        ['Clics Totaux', kpis.totalClicks.toLocaleString(), formatEvolution(kpis.evolution?.clicksEvolution || null)],
        ['Réservations Totales', kpis.totalReservations.toString(), formatEvolution(kpis.evolution?.reservationsEvolution || null)],
        ['Couverts Totaux', kpis.totalCovers.toString(), formatEvolution(kpis.evolution?.coversEvolution || null)],
        ['Taux de Conversion', `${kpis.conversion.toFixed(1)}%`, formatEvolution(kpis.evolution?.conversionEvolution || null)]
      ];

      const kpiTable = autoTable(doc, {
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

      // Section Données Effectives - Position dynamique après le tableau KPIs
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('DONNÉES EFFECTIVES (PRÉSENTATIONS RÉELLES)', 20, yPosition);
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50);
      doc.text('Réservations et couverts où les clients se sont réellement présentés', 20, yPosition + 8);

      // Tableau des données effectives
      const effectiveData = [
        ['Réservations Effectives', effectiveReservations.length.toString(), `${((effectiveReservations.length / kpis.totalReservations) * 100).toFixed(1)}%`],
        ['Couverts Effectifs', effectiveCovers.toString(), `${((effectiveCovers / kpis.totalCovers) * 100).toFixed(1)}%`],
        ['Taux de Présentation', `${((effectiveReservations.length / kpis.totalReservations) * 100).toFixed(1)}%`, 'vs total résa'],
        ['No-Shows + Annulations', (kpis.totalReservations - effectiveReservations.length).toString(), `${(((kpis.totalReservations - effectiveReservations.length) / kpis.totalReservations) * 100).toFixed(1)}%`]
      ];

      const effectiveTable = autoTable(doc, {
        startY: yPosition + 18,
        head: [['Métrique Effective', 'Valeur', 'Ratio']],
        body: effectiveData,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [39, 174, 96],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'center' },
          2: { halign: 'center', textColor: [39, 174, 96] }
        }
      });

      // Section Performance par Canal - Position dynamique après le tableau des données effectives
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

      autoTable(doc, {
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
        kpis.evolution?.coversEvolution && kpis.evolution.coversEvolution > 0 ? 
          `• La croissance de ${kpis.evolution.coversEvolution.toFixed(1)}% des couverts témoigne d'une dynamique positive.` :
          `• Le niveau de ${kpis.totalCovers} couverts démontre l'activité du restaurant.`,
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

        autoTable(doc, {
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
          doc.text(`... et ${reservations.length - 50} autres réservations`, 20, 280);
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

  const generatePeriodReport = (periodLabel: string, periodMonths: PeriodMonthData[]) => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      // Totaux sur la période
      const totalClicks = periodMonths.reduce((sum, m) => sum + m.kpis.totalClicks, 0);
      const totalReservations = periodMonths.reduce((sum, m) => sum + m.kpis.totalReservations, 0);
      const totalCovers = periodMonths.reduce((sum, m) => sum + m.kpis.totalCovers, 0);
      const conversion = totalClicks > 0 ? (totalReservations / totalClicks) * 100 : 0;
      const allReservations = periodMonths.flatMap(m => m.reservations);
      const effectiveReservations = allReservations.filter(r => r.status === 'show');
      const effectiveCovers = effectiveReservations.reduce((sum, r) => sum + r.guests_count, 0);

      // Agrégation par canal sur toute la période
      const channelMap = new Map<string, ChannelData>();
      periodMonths.forEach(m => {
        m.channels.forEach(c => {
          const existing = channelMap.get(c.name);
          if (existing) {
            existing.clicks += c.clicks;
            existing.reservations += c.reservations;
            existing.covers += c.covers;
          } else {
            channelMap.set(c.name, { ...c });
          }
        });
      });
      const channels = Array.from(channelMap.values())
        .map(c => ({ ...c, conversion: c.clicks > 0 ? (c.reservations / c.clicks) * 100 : 0 }))
        .sort((a, b) => b.reservations - a.reservations);

      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('PRINCE PALACE', 20, 25);

      doc.setFontSize(16);
      doc.setFont(undefined, 'normal');
      doc.text(`Rapport - ${periodLabel}`, 20, 35);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Généré le ${currentDate}`, 20, 45);

      doc.setDrawColor(200);
      doc.line(20, 50, 190, 50);

      // Résumé exécutif
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('RÉSUMÉ EXÉCUTIF', 20, 65);

      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(50);

      const executiveSummary = [
        `Ce rapport présente les performances commerciales de Prince Palace sur la période : ${periodLabel}.`,
        `L'analyse porte sur ${channels.length} canaux de distribution actifs, représentant un total de`,
        `${totalClicks.toLocaleString()} clics générés, ${totalReservations} réservations confirmées`,
        `et ${totalCovers} couverts servis. Le taux de conversion global s'établit à ${conversion.toFixed(1)}%.`
      ];

      let yPosition = 75;
      executiveSummary.forEach(line => {
        doc.text(line, 20, yPosition);
        yPosition += 6;
      });

      // KPIs de la période
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('INDICATEURS CLÉS DE PERFORMANCE', 20, yPosition);

      autoTable(doc, {
        startY: yPosition + 10,
        head: [['Métrique', 'Valeur']],
        body: [
          ['Clics Totaux', totalClicks.toLocaleString()],
          ['Réservations Totales', totalReservations.toString()],
          ['Couverts Totaux', totalCovers.toString()],
          ['Taux de Conversion', `${conversion.toFixed(1)}%`],
          ['Réservations Effectives (présentations réelles)', effectiveReservations.length.toString()],
          ['Couverts Effectifs', effectiveCovers.toString()],
        ],
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        columnStyles: { 0: { fontStyle: 'bold' }, 1: { halign: 'center' } }
      });

      // Tableau par mois
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('DÉTAIL PAR MOIS', 20, yPosition);

      autoTable(doc, {
        startY: yPosition + 10,
        head: [['Mois', 'Clics', 'Réservations', 'Couverts', 'Conversion']],
        body: periodMonths.map(m => [
          m.label,
          m.kpis.totalClicks.toLocaleString(),
          m.kpis.totalReservations.toString(),
          m.kpis.totalCovers.toString(),
          `${m.kpis.conversion.toFixed(1)}%`
        ]),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { fontStyle: 'bold' },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        }
      });

      // Performance par canal
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0);
      doc.text('PERFORMANCE PAR CANAL DE DISTRIBUTION', 20, yPosition);

      autoTable(doc, {
        startY: yPosition + 10,
        head: [['Canal', 'Clics', 'Résa.', 'Couv.', 'Conv.']],
        body: channels.map(c => [
          c.name,
          c.clicks.toLocaleString(),
          c.reservations.toString(),
          c.covers.toString(),
          `${c.conversion.toFixed(1)}%`
        ]),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [52, 73, 94], textColor: 255, fontStyle: 'bold' },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { halign: 'center' },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        }
      });

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

      const fileName = `prince-palace-rapport-${periodLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      doc.save(fileName);

      return { success: true, fileName };
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  return { generateMonthlyReport, generatePeriodReport };
};