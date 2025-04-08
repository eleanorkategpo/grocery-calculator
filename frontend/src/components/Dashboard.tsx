import {
  AppBar,
  Toolbar,
  IconButton, Box
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

  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
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
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="primary"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => handleCheckout()}
          >
            <CartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SideBar open={open} setOpen={setOpen} />
      <MyCart />
      <Footer />
    </Box>
  );
};

export default Dashboard;
