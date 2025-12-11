import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { useTickets } from '../context/TicketContext';
import TicketAPI from '../services/TicketAPI';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tickets } = useTickets();
  
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cherche d'abord dans le contexte local
    const found = tickets.find(t => t.id.toString() === id);
    if (found) {
      setTicket(found);
      setLoading(false);
    } else {
      // Sinon fetch depuis l'API
      TicketAPI.getTicketById(id)
        .then(res => {
          setTicket(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, tickets]);

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" variant="primary" />
    </Container>
  );
  
  if (!ticket) return (
    <Container className="text-center mt-5">
      <h2 className="text-danger">Ticket Not Found</h2>
      <Button variant="secondary" className="mt-3" onClick={() => navigate('/admin')}>Back to List</Button>
    </Container>
  );

  // Badge couleur selon le statut
  const statusColor = {
    'New': 'primary',
    'Open': 'primary',
    'Under Review': 'warning',
    'Resolved': 'success'
  }[ticket.status] || 'secondary';

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow border-0 rounded-4" style={{ width: '100%', maxWidth: '800px' }}>
        
        {/* Header */}
        <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom py-3">
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>←</Button>
            <span className="h5 mb-0 text-dark fw-bold">Ticket #{ticket.id}</span>
          </div>
          <Badge bg={statusColor} className="px-3 py-2 rounded-pill">{ticket.status}</Badge>
        </Card.Header>

        <Card.Body className="p-4">
          <small className="text-uppercase text-muted fw-bold" style={{fontSize: '0.8rem'}}>
            {ticket.category || 'General'}
          </small>
          
          <Card.Title className="display-6 fw-bold mb-4 text-primary">
            {ticket.title}
          </Card.Title>
          
          <div className="mb-4">
            <h6 className="text-muted mb-2">Issue Description:</h6>
            <div className="p-4 bg-light rounded-3 border">
              {ticket.description}
            </div>
          </div>

          {/* Attachment display */}
          <div className="my-4">
            <h6 className="text-muted mb-2">Attachment:</h6>
            {ticket.attachment_url ? (
              <div className="text-center border rounded p-2">
                <img 
                  src={ticket.attachment_url} 
                  alt="Attachment" 
                  className="img-fluid rounded shadow-sm mb-3"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="d-grid">
                  <a 
                    href={ticket.attachment_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline-primary btn-sm"
                  >
                    📎 View / Download Original File
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-muted">No attachment provided.</p>
            )}
          </div>

          <hr className="my-4" />
          
          {/* Footer metadata */}
          <div className="d-flex justify-content-between text-muted small">
            <div>
              📅 Created on: <strong>{new Date(ticket.createdAt || ticket.created_at).toLocaleDateString()}</strong>
              <span className="mx-2">at</span>
              <strong>{new Date(ticket.createdAt || ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>
            </div>
            <div>
              👤 Author: <strong>{ticket.createdBy_username || ticket.username || 'User'}</strong>
            </div>
          </div>

        </Card.Body>
      </Card>
    </Container>
  );
};

export default TicketDetails;
