import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, FloatingLabel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Make sure you have a 'register' function in your AuthContext
  const { register } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Client-side validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    setLoading(true);

    try {
      // 2. Call backend
      await register(formData.username, formData.email, formData.password);
      
      // 3. Redirect (either to login or dashboard if auto-login)
      navigate('/dashboard'); 

    } catch (err) {
      const message = err.response?.data?.message || "An error occurred during signup.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center min-vh-100 bg-light">
      <Container className="d-flex justify-content-center">
        <Card className="shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '450px' }}>
          <Card.Body className="p-5">
            
            {/* Header with Icon (Green for signup) */}
            <div className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                👤
              </div>
              <h2 className="fw-bold text-dark">Create an Account</h2>
              <p className="text-muted small">Join us in just a few seconds.</p>
            </div>

            {/* Error message */}
            {error && <Alert variant="danger" className="text-center py-2 fade show">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              
              {/* Username */}
              <FloatingLabel controlId="floatingInputUser" label="Username" className="mb-3">
                <Form.Control 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleChange}
                  required 
                  autoFocus
                />
              </FloatingLabel>

              {/* Email */}
              <FloatingLabel controlId="floatingInputEmail" label="Email Address" className="mb-3">
                <Form.Control 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </FloatingLabel>

              {/* Password */}
              <div className="mb-3 position-relative">
                <FloatingLabel controlId="floatingPassword" label="Password">
                  <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                    style={{ paddingRight: '45px' }}
                  />
                </FloatingLabel>
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  className="text-muted opacity-75"
                  style={{
                    position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)',
                    cursor: 'pointer', zIndex: 5, userSelect: 'none'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <FloatingLabel controlId="floatingConfirmPassword" label="Confirm Password">
                  <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required 
                    className={formData.confirmPassword && formData.password !== formData.confirmPassword ? "is-invalid" : ""}
                  />
                </FloatingLabel>
              </div>

              {/* Signup Button */}
              <Button 
                variant="success" 
                type="submit" 
                className="w-100 py-2 fw-bold rounded-pill"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Form>

            {/* Link to Login */}
            <div className="text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <Link to="/login" className="text-decoration-none fw-bold text-primary">Login</Link>
            </div>

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Signup;
