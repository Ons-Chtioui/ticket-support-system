import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, FloatingLabel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1️⃣ Call backend via context
      // userData will contain the response (accessToken, refreshToken, roles, etc.)
      const userData = await login(username, password);

      // 2️⃣ Store token and other info in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      // 3️⃣ Check roles for redirection
      const roles = userData.roles || []; // safety if roles is empty
      const isAdmin = roles.includes('admin') || roles.includes('ROLE_ADMIN');

      console.log("Detected roles:", roles);

      // 4️⃣ Redirect after login
      navigate(isAdmin ? '/admin' : '/dashboard');

    } catch (err) {
      console.error("Login error:", err);
      const message = err.response?.data?.message || 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center min-vh-100 bg-light">
      <Container className="d-flex justify-content-center">
        <Card className="shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-5">
            {/* Header with Icon */}
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                🔒
              </div>
              <h2 className="fw-bold text-dark">Login</h2>
              <p className="text-muted small">Enter your credentials to access your account.</p>
            </div>

            {/* Error message */}
            {error && <Alert variant="danger" className="text-center py-2 fade show">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Username Field */}
              <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                <Form.Control 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                  autoFocus
                />
              </FloatingLabel>

              {/* Password Field */}
              <div className="mb-4 position-relative">
                <FloatingLabel controlId="floatingPassword" label="Password">
                  <Form.Control 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    style={{ paddingRight: '45px' }}
                  />
                </FloatingLabel>
                
                {/* Eye icon */}
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                  className="text-muted opacity-75"
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    zIndex: 5,
                    userSelect: 'none'
                  }}
                  title={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>

              {/* Submit Button */}
              <Button 
                variant="primary" 
                type="submit" 
                className="w-100 py-2 fw-bold rounded-pill"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2"/>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </Form>

            {/* Link to Signup */}
            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account yet? </span>
              <Link to="/signup" className="text-decoration-none fw-bold">Sign Up</Link>
            </div>

          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
