import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Avatar
} from '@mui/material';
import { 
  Build as BuildIcon,
  ElectricBolt as ElectricIcon,
  Brush as BrushIcon,
  AcUnit as AcIcon,
  Plumbing as PlumbingIcon,
  Carpenter as CarpenterIcon,
  CleaningServices as CleaningIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const categories = [
  {
    id: 1,
    name: 'Plumbing',
    icon: <PlumbingIcon />,
    description: 'Professional plumbing services for your home',
    image: '/services/plumbing.jpg'
  },
  {
    id: 2,
    name: 'Electrical',
    icon: <ElectricIcon />,
    description: 'Expert electrical repair and installation',
    image: '/services/electrical.jpg'
  },
  {
    id: 3,
    name: 'Carpentry',
    icon: <CarpenterIcon />,
    description: 'Custom carpentry and woodwork solutions',
    image: '/services/carpentry.jpg'
  },
  {
    id: 4,
    name: 'Painting',
    icon: <BrushIcon />,
    description: 'Professional painting services',
    image: '/services/painting.jpg'
  },
  {
    id: 5,
    name: 'AC Repair',
    icon: <AcIcon />,
    description: 'AC maintenance and repair services',
    image: '/services/ac-repair.jpg'
  },
  {
    id: 6,
    name: 'Cleaning',
    icon: <CleaningIcon />,
    description: 'Professional cleaning services',
    image: '/services/cleaning.jpg'
  },
  {
    id: 7,
    name: 'Home Repair',
    icon: <BuildIcon />,
    description: 'General home repair and maintenance',
    image: '/services/home-repair.jpg'
  },
  {
    id: 8,
    name: 'Renovation',
    icon: <HomeIcon />,
    description: 'Complete home renovation services',
    image: '/services/renovation.jpg'
  }
];

const ServiceCard = ({ category, onSelect }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          borderRadius: 2,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 28px rgba(0,0,0,0.15)',
          }
        }}
        onClick={() => onSelect(category)}
      >
        <CardMedia
          component="img"
          height="140"
          image={category.image || '/tools.avif'}
          alt={category.name}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box 
              sx={{ 
                mr: 1,
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {category.icon}
            </Box>
            <Typography variant="h6" component="h3">
              {category.name}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {category.description}
          </Typography>
          
          {/* Sample stats */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              size="small" 
              label="Available Now" 
              color="success" 
              variant="outlined"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={4.5} precision={0.5} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                (4.5)
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ServiceCategories = ({ onCategorySelect }) => {
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Browse Services
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" paragraph>
          Choose from our wide range of professional services
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.id}>
              <ServiceCard 
                category={category}
                onSelect={onCategorySelect}
              />
            </Grid>
          ))}
        </Grid>

        {/* Removed static "Top Rated Professionals" section to avoid frontend-only features
            The service categories now only show backend-driven categories and rely on
            actual worker listings for real professionals. */}
      </Container>
    </Box>
  );
};

export default ServiceCategories;