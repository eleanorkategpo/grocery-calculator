import {
  AppBar,
  Toolbar,
  IconButton, Box,
  Menu,
  MenuItem,
  Button
} from "@mui/material";
import MyCart from "./Dashboard/MyCart";
import Footer from "./Dashboard/Footer";
import SideBar from "./Dashboard/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import CartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./shared/LoadingOverlay";
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuItems = [
    {
      text: "My Profile",
      path: "/profile",
    },
    {
      text: "My Cart",
      path: "/dashboard",
    },
    {
      text: "Receipts",
      path: "/receipts",
    },
  ];
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: "60px",
      }}
    >
      <LoadingOverlay loading={loading} />
      <AppBar
        position="fixed"
        sx={{ top: 0, left: 0, right: 0, zIndex: 1000, height: "60px" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <MenuIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2, fontSize: 14 }}
            onClick={() => handleCheckout()}
          >
            <CartIcon />
            Checkout
          </Button>
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => handleMenuItemClick(item.path)}
            >
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>

      <MyCart />
      <Footer />
    </Box>
  );
};

export default Dashboard;
