import { Box, Divider, Paper, Typography, Grid } from "@mui/material";
import UserStore from "../../store/UserStore";
import dayjs from "dayjs";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grocery, GroceryItem } from "../../constants/Schema";

const API_URL = import.meta.env.VITE_API_URL;

const MyCart = () => {
  const userStore = UserStore();
  const { groceryId } = useParams();
  const [groceryData, setGroceryData] = useState<Grocery | null>(null);

  useEffect(() => {
    axios.get(`${API_URL}/grocery/${groceryId}`).then((res) => {
      setGroceryData(res.data.data.grocery);
    });
    axios.get(`${API_URL}/grocery/${groceryId}/items`).then((res) => {
      userStore.setCartItems(res.data.data.groceryItems);
    });
  }, [groceryId]);

  return (
    <Box
      sx={{
        padding: 2,
        width: "100%",
        height: "100%",
        color: "white",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" className="cutive-font" py={2} fontWeight="bold">
        * MY CART *
      </Typography>
      <GrandTotal groceryData={groceryData} />
      <Paper
        elevation={3}
        sx={{ padding: 2, borderRadius: 2, mt: 1, textAlign: "left" }}
        className="cutive-font"
      >
        <Typography variant="body1" color="black" my={1}>
          Items
        </Typography>

        <Typography variant="subtitle2" color="black">
          {groceryData?.storeName}
        </Typography>
        <Typography variant="subtitle2" color="black">
          {dayjs().format("MMMM D, YYYY, h:mm a")}
        </Typography>
        <Divider sx={{ my: 1, backgroundColor: "black" }} />

        {userStore.cartItems.length == 0 ? (
          <Typography variant="body1" color="black">
            No items in cart
          </Typography>
        ) : (
          userStore.cartItems.map((item) => (
            <Grid container key={item.barcode} spacing={1}>
              <Grid
                size={{ xs: 5 }}
                sx={{
                  textAlign: "left",
                  textWrap: "wrap",
                  overflow: "visible",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <Typography variant="body1">{item.description}</Typography>
              </Grid>
              <Grid
                size={{ xs: 1 }}
                sx={{
                  textAlign: "left",
                  textWrap: "wrap",
                  overflow: "visible",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <Typography variant="body1">{item.quantity}</Typography>
              </Grid>
              <Grid
                size={{ xs: 3 }}
                textAlign="right"
                sx={{
                  textAlign: "left",
                  textWrap: "wrap",
                  overflow: "visible",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <Typography variant="body1">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                  }).format(item.price)}
                </Typography>
              </Grid>
              <Grid
                size={{ xs: 3 }}
                textAlign="right"
                sx={{
                  textAlign: "left",
                  textWrap: "wrap",
                  overflow: "visible",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                <Typography variant="body1">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "PHP",
                  }).format(item.total)}
                </Typography>
              </Grid>
            </Grid>
          ))
        )}

        <Divider sx={{ my: 1, backgroundColor: "black" }} />

        <Typography variant="body1" color="black">
          Item Count: {userStore.cartItems.length}
        </Typography>
      </Paper>
      <Footer />
    </Box>
  );
};

const GrandTotal = ({ groceryData }: { groceryData: Grocery | null }) => {
  const userStore = UserStore();
  const grandTotal = userStore.cartItems.reduce(
    (acc, item) => acc + item.total,
    0
  );
  const [isOverBudget, setIsOverBudget] = useState(false);

  useEffect(() => {
    if (grandTotal > (groceryData?.budget ?? 0)) {
      setIsOverBudget(true);
    }
  }, [grandTotal]);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "black",
        padding: 2,
        borderRadius: 2,
        color: "#39FF14",
        width: "100%",
        height: "80px",
        alignItems: "center",
        mt: 1,
      }}
    >
      {isOverBudget && (
        <Typography variant="body1" color="red" textAlign="left">
          Over budget{" "}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
          }).format((groceryData?.budget ?? 0) - grandTotal)}
        </Typography>
      )}
      <Typography variant="h6" className="number-font" width="100%">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP",
        }).format(grandTotal)}
      </Typography>
    </Box>
  );
};

export default MyCart;
