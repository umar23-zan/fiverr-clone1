import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';
import '../auth.css'
import logo from '../images/Giggo-logo.svg'
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
  } from '@mui/material';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: "Buyer",
    });
    const { name, email, password, confirmPassword, role } = formData;
    const [alert, setAlert] = useState(null); // For showing alerts
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
          setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          return;
        }
        setLoading(true);
        try {
            const res = await signup(formData);
            setAlert({ type: 'success', message: 'Signup successful!' });
            console.log(res);
             // Clear any existing errors
            setError('');
            // Clear the form
            setFormData({
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              role: "Buyer",
          });

          setTimeout(() => {
            setAlert(null); // Hide the alert
            navigate('/');
          }, 1500);
            
        } catch (err) {
          console.error('Signup error:', err.response?.data || err.message);
          setError(err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || 'Failed to create account');
        } finally {
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
            Sign Up
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {alert && (
              <Alert severity={alert.type} sx={{ mb: 2 }}>
                {alert.message}
              </Alert>
            )}

          <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
              value={name}
              onChange={onChange}
              disabled={loading}
              autoComplete="name"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={onChange}
              disabled={loading}
              type="email"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={onChange}
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
              onChange={onChange}
              disabled={loading}
              autoComplete="new-password"
            />
            <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label"></InputLabel>
            <Select
              labelId="role-select-label"
              name="role"
              value={role}
              onChange={onChange}
            >
              <MenuItem value="Buyer">Buyer</MenuItem>
              <MenuItem value="Seller">Seller</MenuItem>
              <MenuItem value="Both">Both</MenuItem>
            </Select>
          </FormControl>
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/')}
                sx={{
                  color: '#00A86B',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#002d62',
                  },
                }}
                disabled={loading}
              >
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
            
        </div>
    );
};

export default Signup;
