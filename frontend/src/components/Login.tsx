import {
  Box,
  Button,
  CircularProgress,
  createTheme,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import GroceryLogo from "../assets/groceries.svg";
import InputAdornment from "@mui/material/InputAdornment";
import { EmailOutlined, LockOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";

const Login = () => {
  const theme = createTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simple validation
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      if (!email.includes("@")) {
        throw new Error("Please enter a valid email");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/login`, {
          email,
          password,
        })
        .then((res: AxiosResponse) => {
          enqueueSnackbar("Login successful!", {
            variant: "success",
          });
          navigate("/dashboard");
        })
        .catch((err) => {
          enqueueSnackbar(err.message, {
            variant: "error",
          });
        });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        my={2}
      >
        <img src={GroceryLogo} alt="Grocery Calculator" width={100} />
        <Typography
          variant="h4"
          component="h1"
          align="center"
          gutterBottom
          color="text.secondary"
        >
          Grocery Calculator
        </Typography>
      </Stack>
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h1" align="center" gutterBottom>
          LOGIN
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="off"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link
                onClick={() => navigate("/register")}
                variant="body2"
                color="primary"
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
