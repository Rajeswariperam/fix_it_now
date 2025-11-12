import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Card, CardContent, TextField, Button, Typography, Alert, Avatar } from '@mui/material';

function Signup(){
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/signup', formData);
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(()=> navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper' }}>
      <Grid container sx={{ width: { xs: '95%', md: '80%' }, maxWidth: 900, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Box sx={{ height: '100%', background: `url('/bg.webp') center/cover no-repeat` }} />
        </Grid>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%', borderRadius: 0 }}>
            <CardContent sx={{ p: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }} />
                <Typography variant="h5" fontWeight={700}>Create your account</Typography>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" onSubmit={handleSignUp} noValidate>
                <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth label="Password" type="password" name="password" value={formData.password} onChange={handleChange} sx={{ mb: 2 }} />
                <TextField fullWidth select label="Role" name="role" value={formData.role} onChange={handleChange} SelectProps={{ native: true }} sx={{ mb: 3 }}>
                  <option value="worker">Worker</option>
                  <option value="client">Client</option>
                  <option value="admin">Admin</option>
                </TextField>

                <Button type="submit" variant="contained" fullWidth size="large">Sign up</Button>
              </Box>

              <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
                Already have an account? <a href="/login">Login</a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
export default Signup;