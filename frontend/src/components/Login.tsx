import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography, Link } from "@mui/material";
import GroceryLogo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("user");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      if (!email.includes("@")) {
        throw new Error("Invalid email format");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      localStorage.setItem("user", JSON.stringify(res.data));
      enqueueSnackbar("Login successful!", { variant: "success" });
      navigate("/dashboard/new-grocery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        background: 'var(--gradient-color)',
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleLogin}
        elevation={6}
        sx={{
          maxWidth: 400,
          minWidth: 300,
          width: '100%',
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: 'var(--paper-background-color)',
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Box component="img" src={GroceryLogo} alt="KuripotKart" sx={{ width: 160, height: 150 }} />
          <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: "Cutive" }}>Kuripot Smart, Grocery Cart</Typography>
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          <TextField
            label="Email Address"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Signing In' : 'Sign In'}
          </Button>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>
              Sign Up
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
