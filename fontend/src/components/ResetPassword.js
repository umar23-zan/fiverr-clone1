import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../api/auth'; 
import logo from '../images/Giggo-logo.svg'
import '../auth.css'
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    CircularProgress
  } from '@mui/material';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
          }
          setLoading(true);
        try {
            const response = await resetPassword(token, { password });
            // Check if response data exists
            if (response && response.data) {
                setSuccess(response.data.message || 'Password reset successfully.');
                setError('');
                // Clear input fields
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            console.error('Error resetting password:', err);
            // Handle error message
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'An error occurred. Please try again.');
            } else {
                setError('An error occurred. Please try again.');
            }
        }finally {
            setLoading(false);
          }
    };

    return (
        <div>
            <div className='header-section'>
                <img src={logo} alt="logo" className='fiverr-logo'/>
                
            </div>
            <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Reset Password
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && <p style={{ color: 'green' }}>{success}</p>}

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              autoComplete="new-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                bgcolor: '#00A86B', 
                '&:hover': { 
                  bgcolor: '#008f5a' 
                }
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
            </Button>
            
          </Box>
        </Paper>
      </Box>
    </Container>
        </div>
    );
};

export default ResetPassword;
