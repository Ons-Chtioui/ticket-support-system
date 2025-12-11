import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Spinner, FloatingLabel } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Décodage JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
};

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
    setLoading(true);
    setError('');

    try {
        const userData = await login(username, password);
        const decoded = decodeJWT(userData.access);
        const isAdmin = decoded?.role === 'Admin';

        // Redirection
        navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
        setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="d-flex align-items-center min-vh-100 bg-light">
      <Container className="d-flex justify-content-center">
        <Card className="shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '400px' }}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                🔒
              </div>
              <h2 className="fw-bold text-dark">Login</h2>
              <p className="text-muted small">Enter your credentials to access your account.</p>
            </div>

            {error && <Alert variant="danger" className="text-center py-2">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
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

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  className="text-muted"
                  style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </span>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100 py-2 fw-bold rounded-pill"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Logging in...
                  </>
                ) : 'Login'}
              </Button>
            </Form>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account yet? </span>
              <Link to="/signup" className="fw-bold">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
