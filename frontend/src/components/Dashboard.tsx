import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import Footer from "./Dashboard/Footer";
import MenuIcon from "@mui/icons-material/Menu";
import CartIcon from "@mui/icons-material/ShoppingCart";
import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import LoadingOverlay from "./shared/LoadingOverlay";
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  const path = useLocation();
  const inCart = path.pathname.includes("/cart");

  const menuItems = [
    {
      text: "Generate New Cart",
      path: "/dashboard/new-grocery",
    },
    {
      text: "Previous Carts",
      path: "/dashboard/previous-carts",
    },
    {
      text: "Logout",
      onClick: () => handleLogout(),
    },
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .get(`${API_URL}/auth/logout`)
          .then((res: any) => {
            axios.defaults.headers.common["Authorization"] = null;
            localStorage.removeItem("user");
            navigate("/");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path: string | undefined) => {
    if (path) {
      navigate(path);
    }
    handleMenuClose();
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
          {inCart && <Button
            variant="contained"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2, fontSize: 14 }}
            onClick={() => handleCheckout()}
          >
            <CartIcon />
            Checkout
          </Button>}
        </Toolbar>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.text}
              onClick={() => item.onClick?.() ?? handleMenuItemClick(item.path)}
            >
              {item.text}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>
      <Box sx={{ flexGrow: 1, paddingTop: "60px"}}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
