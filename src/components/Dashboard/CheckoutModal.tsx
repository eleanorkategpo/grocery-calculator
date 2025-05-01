import { useState } from "react";
import {
  Box,
  Stack,
  styled,
  Typography,
  Button,
  Modal,
  IconButton, InputLabel,
  FormControl,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import UserStore from "../../store/UserStore";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import CurrencyInput from "react-currency-input-field";

const API_URL = import.meta.env.VITE_API_URL;

const BoxStyled = styled(Box)(() => ({
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "center",
  margin: "0 auto",
  width: "90%",
  maxWidth: 500,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: "fit-content",
}));

const CheckoutModal = () => {
  const userStore = UserStore();
  const { groceryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountTendered, setAmountTendered] = useState("");

  // Calculate total amount from cart items
  const totalAmount =
    userStore.groceryData?.items?.reduce((sum, item) => sum + item?.total, 0) ??
    0;

  const handleClose = () => {
    userStore.setOpenCheckoutModal(false);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const checkoutData = {
        checkoutDate: new Date(),
        totalAmount,
        paidWith: paymentMethod,
        amountTendered: parseFloat(amountTendered) || totalAmount,
      };

      const response = await axios.patch(
        `${API_URL}/grocery/${groceryId}`,
        checkoutData
      );

      if (response.status === 200) {
        enqueueSnackbar("Checkout successful!", {
          variant: "success",
        });

        // Close modal and navigate to dashboard
        handleClose();
        setTimeout(() => {
          navigate("/dashboard/previous-carts");
        }, 1000);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      enqueueSnackbar("Failed to checkout. Please try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getChange = () => {
    const tendered = parseFloat(amountTendered) || 0;
    return Math.max(0, tendered - totalAmount);
  };

  return (
    <Modal open={userStore.openCheckoutModal} onClose={handleClose}>
      <BoxStyled>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          width="100%"
          sx={{
            position: "absolute",
            top: 0,
            zIndex: 1000,
            padding: 2,
            height: 50,
          }}
        >
          <Typography variant="h6">Checkout</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon color="secondary" />
          </IconButton>
        </Stack>

        <Box sx={{ overflow: "auto", paddingTop: "40px", width: "100%" }}>
          <Stack direction="column" spacing={3} width="100%">
            <Box>
              <InputLabel>Total Amount</InputLabel>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "PHP",
                }).format(totalAmount)}
              </Typography>
            </Box>

            <Box>
              <InputLabel id="payment-method-label">Payment Method</InputLabel>
              <FormControl fullWidth>
                <Select
                  variant="outlined"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="credit">Credit Card</MenuItem>
                  <MenuItem value="debit">Debit Card</MenuItem>
                  <MenuItem value="gcash">GCash</MenuItem>
                  <MenuItem value="paymaya">PayMaya</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {paymentMethod === "cash" && (
              <>
                <Box>
                  <InputLabel>Amount Tendered</InputLabel>
                  <CurrencyInput
                    value={amountTendered}
                    onValueChange={(value) => setAmountTendered(value || "")}
                    prefix="₱ "
                    placeholder="0.00"
                    className="number-font"
                    style={{
                      width: "100%",
                      height: 56,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      fontSize: 18,
                      padding: "0 14px",
                      marginTop: 8,
                      color: "var(--neon-green)",
                      backgroundColor: "black",
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Change
                  </Typography>
                  <Typography
                    variant="h5"
                    color={getChange() >= 0 ? "success.main" : "error.main"}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "PHP",
                    }).format(getChange())}
                  </Typography>
                </Box>
              </>
            )}

            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={
                loading ||
                (paymentMethod === "cash" &&
                  parseFloat(amountTendered || "0") > totalAmount)
              }
              onClick={handleCheckout}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ShoppingCartCheckoutIcon />
                )
              }
              sx={{ mt: 2 }}
            >
              {loading ? "Processing..." : "Complete Checkout"}
            </Button>
          </Stack>
        </Box>
      </BoxStyled>
    </Modal>
  );
};

export default CheckoutModal;
