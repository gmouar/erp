import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../context/AuthContext';

const TwoFactorVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { verify2FA } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await verify2FA(verificationCode);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid verification code. Please try again.');
      setVerificationCode('');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setVerificationCode(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={handleBackToLogin}
            sx={{ mr: 1 }}
            aria-label="back to login"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            Two-Factor Authentication
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Enter the 6-digit code from your authenticator app
          </Typography>
        </Box>

        <form onSubmit={handleVerification}>
          <TextField
            fullWidth
            label="Verification Code"
            value={verificationCode}
            onChange={handleCodeChange}
            margin="normal"
            autoFocus
            required
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]*',
              inputMode: 'numeric'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SecurityIcon color="action" />
                </InputAdornment>
              ),
            }}
            error={!!error}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || verificationCode.length !== 6}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
        </form>

        <Typography variant="body2" color="text.secondary" align="center">
          Open your authenticator app to view your verification code
        </Typography>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            color="primary"
            onClick={handleBackToLogin}
            startIcon={<ArrowBackIcon />}
          >
            Back to Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default TwoFactorVerification;
