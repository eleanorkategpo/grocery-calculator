import React from "react";
import { Box, useTheme } from "@mui/material";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflow: "auto",
        }}
      >
        {/* Page content */}
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
