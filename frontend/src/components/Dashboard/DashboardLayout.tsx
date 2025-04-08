import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar for desktop */}
      {!isMobile && (
        <Sidebar 
          variant="persistent" 
          open={sidebarOpen} 
          onClose={handleSidebarClose} 
        />
      )}
      
      {/* Mobile sidebar is rendered inside the Sidebar component */}
      {isMobile && <Sidebar />}
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sidebarOpen ? 250 : 0}px)` },
          marginLeft: { md: sidebarOpen ? '250px' : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflow: 'auto',
        }}
      >
        {/* Page content */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout; 