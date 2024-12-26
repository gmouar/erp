import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Fade
} from '@mui/material';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({
        username: credentials.username.trim(),
        password: credentials.password
      });
      
      if (result.success) {
        if (result.requires2FA) {
          navigate('/2fa-verify', { state: { from } });
        } else {
          const roleRoutes = {
            'HR': '/hr/dashboard',
            'Finance': '/finance/dashboard',
            'Manufacturing Manager': '/manufacturing/dashboard',
            'Sales': '/sales/dashboard',
            'Supply Chain Manager': '/supply-chain/dashboard'
          };

          const targetRoute = roleRoutes[result.role];
          if (targetRoute) {
            navigate(targetRoute, { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        }
      }
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card elevation={4} sx={{ width: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" mb={4}>
                Sign in to access your account
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  margin="normal"
                  required
                  value={credentials.username}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    username: e.target.value
                  })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  required
                  value={credentials.password}
                  onChange={(e) => setCredentials({
                    ...credentials,
                    password: e.target.value
                  })}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Fade>
    </Container>
  );
};

export default Login;
