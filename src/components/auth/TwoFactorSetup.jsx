import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Changed from default import
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const TwoFactorSetup = () => {
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const generateSecret = async () => {
      try {
        const response = await fetch('/api/auth/2fa/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to generate 2FA secret');
        
        const data = await response.json();
        setSecret(data.secret);
        setQrCodeUrl(data.qrCodeUrl);
        setLoading(false);
      } catch (err) {
        setError('Failed to setup 2FA. Please try again.');
        setLoading(false);
      }
    };

    generateSecret();
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/2fa/verify-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret,
          token: verificationCode
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Invalid verification code');

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={3}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Two-Factor Authentication Setup
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          {qrCodeUrl && (
            <QRCodeCanvas 
              value={qrCodeUrl}
              size={200}
              level="M"
            />
          )}
        </Box>

        <Typography variant="body1" gutterBottom>
          Scan the QR code with your authenticator app, then enter the verification code below.
        </Typography>

        <form onSubmit={handleVerify}>
          <TextField
            fullWidth
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            margin="normal"
            variant="outlined"
            required
            autoComplete="off"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            Verify
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default TwoFactorSetup;

