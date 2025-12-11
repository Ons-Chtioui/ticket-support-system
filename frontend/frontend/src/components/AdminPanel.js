import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../context/TicketContext';
import TicketFormModal from './TicketFormModal';

const AdminPanel = () => {
  const { tickets, loading, error, deleteTicket, fetchTickets, updateTicketStatus } = useTickets();
  const navigate = useNavigate();

  // --- STATES FOR FILTERS AND PAGINATION ---
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // --- SMART LOAD FUNCTION ---
  const loadData = () => {
    const params = {
      page: page,
      search: searchTerm || undefined,
      category: category || undefined,
      status: statusFilter || undefined,
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
    fetchTickets();
  };

  // --- ACTIONS ---
  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
    setShowModal(true);
  };

  const handleViewDetails = (id) => {
    navigate(`/tickets/${id}`);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      await deleteTicket(id);
      loadData(); // recharge la liste après suppression
    }
  };

  const onFormSubmit = async (data) => {
    try {
      if (editingTicket) {
        await updateTicketStatus(editingTicket.id, data.status);
        loadData();
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Error while updating.");
    }
  };

  // --- HELPER FOR AUTHOR ---
  const getAuthorName = (ticket) => {
    return ticket.createdBy?.username || ticket.createdBy || ticket.createdBy_username || ticket.username || 'Anonymous';
  };

  // --- RENDER ---
  return (
    <Container className="mt-4">
      <h2 className="fw-bold mb-4">Ticket Administration</h2>

      {/* FILTER & SEARCH */}
      <div className="bg-light p-3 rounded shadow-sm mb-4">
        <Form onSubmit={handleSearchSubmit}>
          <Row className="g-3 align-items-end">
            {/* Search */}
            <Col md={4}>
              <Form.Label className="fw-bold small text-muted">Search</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Title or User..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="primary" type="submit">🔍</Button>
              </InputGroup>
            </Col>

            {/* Category Filter */}
            <Col md={3}>
              <Form.Label className="fw-bold small text-muted">Category</Form.Label>
              <Form.Select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
                <option value="">All</option>
                <option value="Technical">Technical</option>
                <option value="Financial">Financial</option>
                <option value="Product">Product</option>
              </Form.Select>
            </Col>

            {/* Status Filter */}
            <Col md={3}>
              <Form.Label className="fw-bold small text-muted">Status</Form.Label>
              <Form.Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </Form.Select>
            </Col>

            {/* Reset */}
            <Col md={2}>
              <div className="d-grid">
                <Button variant="outline-secondary" onClick={handleReset}>Reset</Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <div className="table-responsive shadow rounded bg-white p-3">
            <Table hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets && tickets.length > 0 ? (
                  tickets.map(ticket => (
                    <tr key={ticket.id}>
                      <td><small className="text-muted">#{ticket.id}</small></td>
                      <td>
                        <span className="fw-bold text-dark">{ticket.title}</span><br />
                        <small className="text-muted">
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : '-'}
                        </small>
                      </td>
                      <td>👤 {getAuthorName(ticket)}</td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {ticket.category || 'Uncategorized'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={
                          ticket.status === 'New' ? 'success' :
                          ticket.status === 'Resolved' ? 'secondary' : 'warning'
                        }>
                          {ticket.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleViewDetails(ticket.id)}>👁️</Button>
                        <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEdit(ticket)}>✏️</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => onDelete(ticket.id)}>🗑️</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No tickets found for these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div className="d-flex justify-content-center mt-4 gap-2">
            <Button
              variant="outline-primary"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &laquo; Previous
            </Button>
            <span className="align-self-center fw-bold text-muted px-2">Page {page}</span>
            <Button
              variant="outline-primary"
              disabled={tickets && tickets.length < 10}
              onClick={() => setPage(page + 1)}
            >
              Next &raquo;
            </Button>
          </div>
        </>
      )}

      {/* MODAL */}
      <TicketFormModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={onFormSubmit}
        ticketToEdit={editingTicket}
      />
    </Container>
  );
};

export default AdminPanel;
