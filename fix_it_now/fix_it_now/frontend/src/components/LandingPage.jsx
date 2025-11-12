import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn } from '../utils/authUtils';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  
} from '@mui/material';
import { 
  BuildRounded,
  AccessTimeRounded,
  SecurityRounded,
  StarRounded,
  ArrowForwardRounded,
  CheckCircleRounded,
  ElectricBoltRounded,
  PlumbingRounded,
  BrushRounded,
  AcUnitRounded,
  HandymanRounded,
  CleaningServicesRounded
} from '@mui/icons-material';

const features = [
  {
    icon: <BuildRounded sx={{ fontSize: 40 }} />,
    title: 'Expert Services',
    description: 'Qualified and verified professionals for all your home needs'
  },
  {
    icon: <AccessTimeRounded sx={{ fontSize: 40 }} />,
    title: '24/7 Availability',
    description: 'Get help anytime with our round-the-clock service'
  },
  {
    icon: <SecurityRounded sx={{ fontSize: 40 }} />,
    title: 'Secure Booking',
    description: 'Safe and secure service booking with verified professionals'
  },
  {
    icon: <StarRounded sx={{ fontSize: 40 }} />,
    title: 'Quality Assurance',
    description: 'Satisfaction guaranteed with our quality service commitment'
  }
];

const services = [
  { icon: <PlumbingRounded />, name: 'Plumbing', workers: 45 },
  { icon: <ElectricBoltRounded />, name: 'Electrical', workers: 38 },
  { icon: <HandymanRounded />, name: 'Carpentry', workers: 32 },
  { icon: <BrushRounded />, name: 'Painting', workers: 28 },
  { icon: <AcUnitRounded />, name: 'AC Repair', workers: 25 },
  { icon: <CleaningServicesRounded />, name: 'Cleaning', workers: 50 }
];

// LiveUpdates removed per user request (was simulated client-side notifications)

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // removed live counters per design request; keep hero clean and focused

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.8)), url("/tools.avif")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white' }}>
  {/* Live updates removed as per request */}

      <Container maxWidth="lg">
        <Box sx={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-start', textAlign: isMobile ? 'center' : 'left' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '4rem' }, fontWeight: 700, mb: 2, background: 'linear-gradient(45deg,#2196F3,#21CBF3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Fix It Now</Typography>
            <Typography variant="h5" sx={{ mb: 3, color: 'rgba(255,255,255,0.9)' }}>Professional home services, on demand.</Typography>

            <Box sx={{ mb: 2 }}>
              {/* small project note */}
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>A clean, minimal project demo for on-demand home services — focused on usability.</Typography>
            </Box>

            <motion.div whileHover={{ scale: 1.03 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRounded />}
                onClick={() => {
                  if (isLoggedIn()) {
                    navigate('/home', { state: { showServices: true } });
                  } else {
                    // send guest to login with redirect info so they return to home and see services after login
                    navigate('/login', { state: { redirectTo: '/home', showServices: true } });
                  }
                }}
                sx={{ background: 'linear-gradient(45deg,#2196F3,#21CBF3)', borderRadius: 50, textTransform: 'none' }}
              >
                Explore Services
              </Button>
            </motion.div>
          </motion.div>
        </Box>
      </Container>

      <Box sx={{ bgcolor: 'rgba(0,0,0,0.7)', py: 8, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} whileHover={{ scale: 1.02 }}>
                  <Card sx={{ background: 'rgba(255,255,255,0.04)', color: 'white', borderRadius: 2, border: '1px solid rgba(255,255,255,0.04)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'transparent', width: 64, height: 64 }}>
                          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }} style={{ width: 48, height: 48, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)', color: 'white' }}>
                            {f.icon}
                          </motion.div>
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>{f.title}</Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>{f.description}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container sx={{ py: 8 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 600, color: 'white' }}>Services</Typography>
        <Grid container spacing={3}>
          {services.map((s, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.02 }}>
                <Card sx={{ background: 'rgba(255,255,255,0.04)', color: 'white', borderRadius: 2, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'transparent', width: 64, height: 64 }}>
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }} style={{ width: 48, height: 48, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)', color: 'white' }}>
                          {s.icon}
                        </motion.div>
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>{s.name}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <CheckCircleRounded sx={{ color: '#4caf50', fontSize: 18 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{s.workers} verified professionals</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Container>
          <Typography variant="h5" sx={{ mb: 2 }}>Ready to get started?</Typography>
          <Button variant="contained" onClick={() => navigate('/signup')} sx={{ background: 'linear-gradient(45deg,#2196F3,#21CBF3)', textTransform: 'none' }}>Sign up</Button>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;