import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import { useToast } from '../context/ToastContext';
import TicketFormModal from './TicketFormModal';

const UserDashboard = () => {
  const { tickets, loading, error, addTicket, updateTicket, deleteTicket, fetchTickets } = useTickets();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // --- FILTERS AND PAGINATION ---
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // --- LOAD DATA ---
  const loadData = () => {
    const params = {
      page: page,
      search: searchTerm,
      category: category || undefined,
      status: statusFilter || undefined
    };
    fetchTickets(params);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [page, category, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setStatusFilter('');
    setPage(1);
    fetchTickets(); // Reload without filters
  };

  // --- ACTIONS ---
  const handleCreateClick = () => {
    setEditingTicket(null);
    setShowModal(true);
  };

  const handleEditClick = (ticket, e) => {
    e.stopPropagation();
    setEditingTicket(ticket);
    setShowModal(true);
  };

  const handleViewDetails = (id) => {
    navigate(`/tickets/${id}`);
  };

  const onFormSubmit = async (data) => {
    try {
      if (editingTicket) {
        await updateTicket(editingTicket.id, data);
        showToast('Ticket updated successfully', 'info');
      } else {
        await addTicket(data);
        showToast('Ticket created successfully', 'success');
      }
      loadData();
    } catch (err) {
      showToast('An error occurred', 'danger');
    }
  };

  // --- RENDER ---
  return (
    <Container className="mt-4 position-relative">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">My Dashboard</h2>
        <Button variant="success" size="lg" onClick={handleCreateClick} className="shadow-sm">
          <span className="me-2">➕</span> New Ticket
        </Button>
      </div>

      {/* FILTER BAR */}
      <Card className="border-0 shadow-sm mb-4 bg-light">
        <Card.Body>
          <Form onSubmit={handleSearchSubmit}>
            <Row className="g-2">
              <Col md={4}>
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="primary" type="submit">🔍</Button>
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                  <option value="">All Categories</option>
                  <option value="Technical">Technical</option>
                  <option value="Financial">Financial</option>
                  <option value="Product">Product</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Under Review">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                 <Button variant="outline-secondary" className="w-100" onClick={handleReset}>Reset</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* CONTENT */}
      {loading ? (
        <Container className="text-center mt-5"><Spinner animation="border" /></Container>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Row>
            {tickets && tickets.length > 0 ? (
              tickets.map(ticket => (
                <Col md={6} lg={4} className="mb-4" key={ticket.id}>
                  <Card className="h-100 shadow-sm border-0 hover-shadow transition-card">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between mb-2">
                        <Badge bg={
                          ticket.status === 'New' ? 'warning' : 
                          ticket.status === 'Under Review' ? 'info' : 'secondary'
                        }>
                          {ticket.status}
                        </Badge>

                        <small className="text-muted">
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                        </small>
                      </div>

                      <Card.Title className="text-truncate fw-bold">{ticket.title}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted small">
                        Category: {ticket.category || 'General'}
                      </Card.Subtitle>
                      <Card.Text className="text-muted small flex-grow-1">
                        {ticket.description ? ticket.description.substring(0, 80) : ''}...
                      </Card.Text>

                      <div className="mt-3 pt-3 border-top d-flex gap-2 justify-content-end">
                        <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(ticket.id)}>View</Button>
                        <Button variant="outline-secondary" size="sm" onClick={(e) => handleEditClick(ticket, e)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => deleteTicket(ticket.id)}>🗑️</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center py-5 text-muted bg-light rounded">
                  <h4>No tickets found 🕵️‍♂️</h4>
                  <p>Try adjusting your search filters.</p>
                </div>
              </Col>
            )}
          </Row>

          {/* PAGINATION */}
          {tickets && tickets.length > 0 && (
            <div className="d-flex justify-content-center mt-4 mb-5 gap-3">
              <Button 
                variant="outline-primary" 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
              >
                &laquo; Previous
              </Button>
              <span className="align-self-center fw-bold text-muted">Page {page}</span>
              <Button 
                variant="outline-primary" 
                disabled={tickets.length < 10} 
                onClick={() => setPage(page + 1)}
              >
                Next &raquo;
              </Button>
            </div>
          )}
        </>
      )}

      {/* TICKET MODAL */}
      <TicketFormModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSubmit={onFormSubmit}
        ticketToEdit={editingTicket}
      />
    </Container>
  );
};

export default UserDashboard;
