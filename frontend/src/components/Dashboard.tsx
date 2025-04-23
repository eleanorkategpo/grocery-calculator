import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import LoadingOverlay from "./shared/LoadingOverlay";
import axios from "axios";
import Swal from "sweetalert2";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

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
          <Stack direction="row" alignItems="center" gap={1}>
            <ShoppingCartIcon color="primary" />
            <Typography variant="subtitle2" color="primary">
              YOUR GROCERY ASSISTANT
            </Typography>
          </Stack>
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
      <Box
        sx={{
          flexGrow: 1,
          paddingTop: "60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Dashboard;
