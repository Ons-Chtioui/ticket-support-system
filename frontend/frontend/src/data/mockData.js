export const initialTickets = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Ticket Problème ${i + 1}`,
  description: `Description détaillée du ticket numéro ${i + 1}...`,
  date: new Date(Date.now() - i * 10000000).toLocaleDateString(), // Dates décroissantes
  status: i % 3 === 0 ? 'Ouvert' : 'Fermé'
}));