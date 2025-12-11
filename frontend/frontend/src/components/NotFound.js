import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <Container className="text-center mt-5 pt-5">
    <h1 className="display-1 fw-bold">404</h1>
    <p className="fs-3">Oops! Page not found.</p>
    <p className="lead">The page you are looking for does not exist.</p>
    <Link to="/">
      <Button variant="primary">Back to Home</Button>
    </Link>
  </Container>
);

export default NotFound;
