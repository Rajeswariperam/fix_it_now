import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/authUtils";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  Assignment as AssignmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';

function Navbar() {
  const loggedIn = isLoggedIn();
  const user_role = localStorage.getItem("role");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleProfileClose();
  };

  const workerLinks = [
    { text: 'Pending Jobs', path: '/pending_worker_jobs' },
    { text: 'Rejected Jobs', path: '/rejected_worker_jobs' },
    { text: 'Apply for job', path: '/apply_for_job' },
    { text: 'Pending Job Offers', path: '/job_offers' },
    { text: 'Accepted Job Offers', path: '/Accept_job_offers' },
    { text: 'Rejected Job Offers', path: '/rejected_job_offers' },
    { text: 'Completed Jobs', path: '/completed_jobs' }
  ];

  const clientLinks = [
    { text: 'Recruited', path: '/recruited' },
    { text: 'Pending Requests', path: '/pending_requests' }
  ];

  const adminLinks = [
    { text: 'Accepted Applications', path: '/accepted_applications' },
    { text: 'Rejected Applications', path: '/rejected_applications' },
    { text: 'Workers info', path: '/workers_info' },
    { text: 'Clients info', path: '/clients_info' }
  ];

  const currentLinks = user_role === 'worker' ? workerLinks :
                      user_role === 'client' ? clientLinks :
                      user_role === 'admin' ? adminLinks : [];

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {currentLinks.map((link) => (
          <ListItem 
            button 
            key={link.text}
            onClick={() => handleNavigate(link.path)}
            disabled={!loggedIn}
          >
            <ListItemText primary={link.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <BuildIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={'/'}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: { xs: 1, md: 0 }
            }}
          >
            FIX IT NOW
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {currentLinks.map((link) => (
                <Button
                  key={link.text}
                  onClick={() => handleNavigate(link.path)}
                  sx={{ my: 2, color: 'text.primary', display: 'block' }}
                  disabled={!loggedIn}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          {loggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              <IconButton
                onClick={handleProfileClick}
                sx={{ p: 0 }}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <PersonIcon />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleNavigate('/profile')}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
