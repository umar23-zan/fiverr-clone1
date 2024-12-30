import React, { useState } from 'react';
import { forgotPassword } from '../api/auth'; 
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
    Alert
  } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [alert, setAlert] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await forgotPassword({ email });
            setAlert({ type: 'success', message: res.data.msg });
            setEmail(''); 
        } catch (err) {
            //setAlert({ type: 'error', message: error.response.data.msg });
            setError(err.response?.data?.msg || 'Error logging in');
            console.error(error.response.data);
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
                        Forgot Password
                    </Typography>
                    
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        />
                        
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#00A86B', '&:hover': { bgcolor: '#008f5a' } }}
                        disabled={loading}
                        >
                        {loading ? 'Sending Reset link...' : 'Send Reset Link'}
                        </Button>
                        
                    </Box>
                    </Paper>
                </Box>
    </Container>
            
        </div>
    );
};

export default ForgotPassword;
