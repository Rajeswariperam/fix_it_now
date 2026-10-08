import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Box, Grid, Card, CardContent, TextField, Button, Typography, Alert, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('user_email', res.data.user.email);
      localStorage.setItem('user_name', res.data.user.fullName);
      setSuccess(`Welcome ${res.data.user.fullName}`);
      // Role-based redirect; honor redirectTo if provided in route state
      setTimeout(() => {
        const role = res.data.user.role;
        const redirectTo = location?.state?.redirectTo;
        // Admin always goes to pending_requests
        if (role === 'admin') navigate('/pending_requests');
        else if (redirectTo) {
          // preserve any state passed (e.g., showServices, jobId)
          navigate(redirectTo, { state: { ...(location.state || {}) } });
        } else {
          navigate('/home');
        }
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
      <Grid container sx={{ width: { xs: '95%', md: '80%' }, maxWidth: 900, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ height: '100%', background: `url('/tools.avif') center/cover no-repeat` }} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', borderRadius: 0 }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{/* icon */}</Avatar>
                <Typography variant="h5" fontWeight={700}>Sign in to Fix It Now</Typography>
              </Box>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Password" type="password" name="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField
                  fullWidth
                  select
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  SelectProps={{ native: true }}
                  sx={{ mb: 3 }}
                >
                  <option value="">Select role</option>
                  <option value="worker">Worker</option>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </TextField>

                <Button type="submit" variant="contained" fullWidth size="large">Login</Button>
              </Box>

              <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                Don’t have an account? <a href="/signup">Sign Up</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
