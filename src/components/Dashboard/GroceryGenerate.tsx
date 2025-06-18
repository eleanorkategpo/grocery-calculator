import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  Switch,
  FormControlLabel,
  Fade,
  Grow,
  Divider
} from "@mui/material";
import CurrencyInput from "react-currency-input-field";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../shared/LoadingOverlay";
const API_URL = import.meta.env.VITE_API_URL; 

const GroceryGenerate = () => {
  const navigate = useNavigate();
  const [groceryStore, setGroceryStore] = useState("");
  const [budget, setBudget] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [noBudgetLimit, setNoBudgetLimit] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    // Trigger fade-in animation after component mounts
    setTimeout(() => setFadeIn(true), 100);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const grocery = {
      storeName: groceryStore,
      budget: noBudgetLimit ? null : budget,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      axios
        .post(`${API_URL}/grocery/new-grocery`, grocery)
        .then((response) => {
          const id = response.data.data.grocery._id;
          navigate(`/dashboard/${id}/cart`);
        })
        .catch((error) => {
          console.error("Error creating grocery:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Error creating grocery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay loading={isLoading} />
      <Fade in={fadeIn} timeout={800}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "background.paper",
            p: 3,
            maxWidth: 600,
            mx: "auto",
            m: 2,
            minWidth: +300,
          }}
        >
          <Stack
            direction="column"
            spacing={2}
            component="form"
            onSubmit={handleSubmit}
          >
            <Grow in={fadeIn} timeout={1000}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                justifyContent="center"
              >
                <ShoppingCartIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6" fontWeight="bold" color="primary">
                  New Grocery Trip
                </Typography>
              </Stack>
            </Grow>
            <Divider sx={{ backgroundColor: "var(--text-color)" }} />

            <Grow in={fadeIn} timeout={1200}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <CalendarTodayIcon color="primary" />
                <Typography variant="body1">{currentDateTime}</Typography>
              </Stack>
            </Grow>

            <Grow in={fadeIn} timeout={1400}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <StorefrontIcon color="primary" />
                  <Typography variant="body1" fontWeight="medium">
                    Where are you shopping today?
                  </Typography>
                </Stack>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={groceryStore}
                  onChange={(e) => setGroceryStore(e.target.value)}
                  placeholder="E.g., Walmart, Target, Costco..."
                />
              </Stack>
            </Grow>

            <Grow in={fadeIn} timeout={1600}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={2}
                >
                  <Typography variant="body1" fontWeight="medium">
                    Set Your Budget
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={noBudgetLimit}
                        onChange={() => setNoBudgetLimit(!noBudgetLimit)}
                        color="primary"
                        sx={{
                          "& .MuiSwitch-track": {
                            backgroundColor: "var(--text-color)",
                          },
                        }}
                      />
                    }
                    label="No Budget Limit"
                  />
                </Stack>

                {!noBudgetLimit && (
                  <CurrencyInput
                    value={budget}
                    onValueChange={(value) => {
                      if (value !== undefined) {
                        setBudget(value);
                      }
                    }}
                    prefix="₱ "
                    placeholder="₱ 0.00"
                    disabled={noBudgetLimit}
                    className="number-font"
                    style={{
                      width: "100%",
                      height: 56,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      fontSize: 18,
                      padding: "0 14px",
                      transition: "all 0.3s ease",
                      color: "var(--neon-green)",
                      backgroundColor: "black",
                      textAlign: "center",
                    }}
                  />
                )}
              </Stack>
            </Grow>

            <Grow in={fadeIn} timeout={1800}>
              <Stack spacing={2} alignItems="center" mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: 18,
                    fontWeight: "bold",
                    boxShadow: 4,
                    transition: "all 0.3s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 6,
                    },
                  }}
                  disabled={!groceryStore || (!noBudgetLimit && !budget) || isLoading}
                >
                  Start Shopping
                </Button>
              </Stack>
            </Grow>
          </Stack>
        </Paper>
      </Fade>
    </>
  );
};

export default GroceryGenerate;
