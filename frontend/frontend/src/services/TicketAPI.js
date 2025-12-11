import api from './api';

const TicketAPI = {
  // MODIFICATION ICI : On accepte un objet 'params' (ex: { search: 'bug', status: 'Ouvert', page: 2 })
  // Axios convertira automatiquement cet objet en ?search=bug&status=Ouvert&page=2
  getAllTickets: (params = {}) => api.get('/tickets/', { params }),

  getTicketById: (id) => api.get(`/tickets/${id}/`),
  
  createTicket: (data) => api.post('/tickets/', data),

  // Mise à jour complète (PUT)
  updateTicket: (id, data) => api.put(`/tickets/${id}/`, data),

  // Mise à jour partielle du statut (PATCH)
  updateStatus: (id, newStatus) => api.patch(`/tickets/${id}/status/`, { status: newStatus }),
  
  deleteTicket: (id) => api.delete(`/tickets/${id}/`)
};

export default TicketAPI;