import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    {
      text: "My Profile",
      path: "/profile",
    },
    {
      text: "My Cart",
      path: "/cart",
    },
    {
      text: "Receipts",
      path: "/receipts",
    },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
      <Box sx={{ width: { xs: "100%", md: "250px" }, p: 2 }}>
        <Typography variant="h6">Menu</Typography>
        <Stack direction="column" spacing={2}>
          <IconButton onClick={handleMenuClick} color="primary">
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {menuItems.map((item) => (
              <MenuItem key={item.text} onClick={() => handleMenuItemClick(item.path)}>
                {item.text}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
