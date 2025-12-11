import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const TicketFormModal = ({ show, handleClose, handleSubmit, ticketToEdit }) => {
  
  // Initial state
  const defaultState = {
    title: '',
    description: '',
    category: 'Technical',
    status: 'New',
    attachment: null,
  };

  const [formData, setFormData] = useState(defaultState);

  // Fill form when modal opens
  useEffect(() => {
    if (show) {
      if (ticketToEdit) {
        // EDIT MODE: Only need current status
        setFormData({
          ...defaultState, // keep defaults to avoid errors
          status: ticketToEdit.status || 'New', 
        });
      } else {
        // CREATE MODE: reset form
        setFormData(defaultState);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, ticketToEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'attachment') {
      setFormData(prev => ({ ...prev, attachment: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (ticketToEdit) {
        // --- CASE 1: EDIT (STATUS ONLY) ---
        // Send a simple JSON object, as updateStatus expects { status: "..." }
        handleSubmit({ status: formData.status });
    } 
    else {
        // --- CASE 2: CREATE (FULL FORM) ---
        // Use FormData for file upload
        const dataToSend = new FormData();
        dataToSend.append('title', formData.title);
        dataToSend.append('description', formData.description);
        dataToSend.append('category', formData.category);
        dataToSend.append('status', 'New'); // Force status to New on creation
        if (formData.attachment) {
            dataToSend.append('attachment', formData.attachment);
        }
        handleSubmit(dataToSend);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton className={ticketToEdit ? "bg-warning" : "bg-primary text-white"}>
        <Modal.Title>
          {ticketToEdit ? 'Update Status' : 'Create New Ticket'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          
          {/* --- EDIT MODE (Status Only) --- */}
          {ticketToEdit ? (
            <>
              <Alert variant="info">
                <strong>Ticket:</strong> {ticketToEdit.title}
              </Alert>
              
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">New Status</Form.Label>
                <Form.Select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                    size="lg"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Resolved">Resolved</option>
                </Form.Select>
              </Form.Group>
            </>
          ) : (
            /* --- CREATE MODE (Full Form) --- */
            <>
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: My PC is broken"
                  required
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Technical">Technical</option>
                  <option value="Financial">Financial</option>
                  <option value="Product">Product</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Attachment (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  name="attachment"
                  onChange={handleChange}
                />
              </Form.Group>
            </>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant={ticketToEdit ? "warning" : "primary"} type="submit">
            {ticketToEdit ? 'Update Status' : 'Submit Ticket'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TicketFormModal;
