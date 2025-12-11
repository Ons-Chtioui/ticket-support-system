import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column justify-content-center">
      
      {/* --- HERO SECTION (Top of page) --- */}
      <Container className="py-5">
        <Row className="align-items-center g-5 py-5">
          {/* Text on the left */}
          <Col lg={6}>
            <h1 className="display-4 fw-bold lh-1 mb-3 text-dark">
              Manage your customer support <span className="text-primary">effortlessly</span>
            </h1>
            <p className="lead text-muted mb-4">
              TicketApp is the all-in-one solution to track, manage, and resolve your users' issues.
              An intuitive, fast interface designed for modern teams.
            </p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <Link to="/login">
                <Button variant="primary" size="lg" className="px-4 me-md-2">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline-secondary" size="lg" className="px-4">Sign Up</Button>
              </Link>
            </div>
          </Col>
          
          {/* Image on the right (Illustration) */}
          <Col lg={6} className="text-center">
            {/* You can replace this URL with a local image in your public folder */}
            <img 
              src="https://img.freepik.com/free-vector/customer-support-illustration_23-2148889374.jpg?w=800" 
              alt="Support Illustration" 
              className="d-block mx-lg-auto img-fluid rounded-3 shadow-lg" 
              style={{ maxHeight: '400px' }}
              loading="lazy" 
            />
          </Col>
        </Row>
      </Container>

      {/* --- FEATURES SECTION (Bottom of page) --- */}
      <Container className="pb-5">
        <Row className="g-4 py-5 row-cols-1 row-cols-lg-3">
          
          <Col>
            <Card className="h-100 border-0 shadow-sm hover-effect">
              <Card.Body className="text-center p-4">
                <div className="display-6 text-primary mb-3">🚀</div>
                <Card.Title className="fw-bold">Fast & Efficient</Card.Title>
                <Card.Text className="text-muted">
                  Create and process tickets in seconds with our optimized interface.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100 border-0 shadow-sm hover-effect">
              <Card.Body className="text-center p-4">
                <div className="display-6 text-success mb-3">🛡️</div>
                <Card.Title className="fw-bold">Secure</Card.Title>
                <Card.Text className="text-muted">
                  Your data is protected. Admin and User role management is built-in.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className="h-100 border-0 shadow-sm hover-effect">
              <Card.Body className="text-center p-4">
                <div className="display-6 text-warning mb-3">📊</div>
                <Card.Title className="fw-bold">Clear Tracking</Card.Title>
                <Card.Text className="text-muted">
                  An intelligent dashboard to view recent tickets and search through history.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Home;
