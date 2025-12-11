import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Secure role check (in case user.roles is an array or string)
  const isAdmin = user && (user.role === 'admin' || (user.roles && user.roles.includes('ROLE_ADMIN')));

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3" sticky="top">
      <Container>
        {/* Logo / Brand */}
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          🎫 TicketApp
        </Navbar.Brand>

        {/* Hamburger Button for Mobile */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Collapsible Content */}
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* --- LEFT LINKS --- */}
          <Nav className="me-auto ms-3">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {/* Dashboard Link (Visible to all logged-in users) */}
            {user && (
              <Nav.Link as={Link} to="/dashboard">My Tickets</Nav.Link>
            )}

            {/* Admin Link (Visible only to admin) */}
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" className="text-warning">
                Administration
              </Nav.Link>
            )}
          </Nav>

          {/* --- RIGHT LINKS (AUTH) --- */}
          <Nav className="align-items-center">
            {!user ? (
              // If NOT logged in
              <>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Button as={Link} to="/signup" variant="primary" size="sm" className="rounded-pill px-3">
                  Sign Up
                </Button>
              </>
            ) : (
              // If Logged in: Dropdown Menu
              <NavDropdown 
                title={
                  <span className="fw-semibold">
                    👤 {user.username}
                  </span>
                } 
                id="user-nav-dropdown" 
                align="end"
              >
                <NavDropdown.Item as={Link} to="/dashboard">My Dashboard</NavDropdown.Item>
                {isAdmin && <NavDropdown.Item as={Link} to="/admin">Admin Panel</NavDropdown.Item>}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
