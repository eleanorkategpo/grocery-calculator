import { Box, Divider, Paper, Typography, Grid, Stack } from "@mui/material";
import UserStore from "../../store/UserStore";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Grocery } from "../../constants/Schema";
import Footer from "./Footer";
import EditCart from "./EditCart";
import LoadingOverlay from "../shared/LoadingOverlay";
import { PriorityHigh } from "@mui/icons-material";
import DeleteCart from "./DeleteCart";
import ShoppingListDrawer from "./ShoppingListDrawer";
const API_URL = import.meta.env.VITE_API_URL;

// Add a small type for our drawer entries

const MyCart = () => {
  const [loading, setLoading] = useState(false);
  const userStore = UserStore();
  const { groceryId } = useParams<{ groceryId: string }>();
  const drawerOpen = userStore.shoppingListDrawerOpen;
  const setDrawerOpen = userStore.setShoppingListDrawerOpen;

  // Fetch cart on mount / groceryId change
  useEffect(() => {
    setLoading(true);
    userStore.setGroceryData(null);

    axios
      .get(`${API_URL}/grocery/${groceryId}`)
      .then((res) => {
        userStore.setGroceryData({
          ...res.data.data.grocery,
          items: res.data.data.items,
        });
      })
      .finally(() => setLoading(false));
  }, [groceryId]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh", // Full viewport height
          position: "relative",
          zIndex: 1, // Lower z-index than drawer
        }}
      >
        <Box
          sx={{
            padding: 2,
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto",
            height: "100%",
            overflow: "auto", // Enable scrolling
            paddingBottom: 20,
            color: "white",
          }}
          className="hide-scrollbar"
        >
          <LoadingOverlay loading={loading} />

          <Typography
            variant="h4"
            className="cutive-font"
            py={2}
            fontWeight="bold"
          >
            * MY CART *
          </Typography>

          <GrandTotal groceryData={userStore.groceryData} />

          <Paper
            elevation={3}
            sx={{ padding: 2, borderRadius: 2, mt: 1, textAlign: "left" }}
            className="cutive-font"
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body1" color="black" my={1}>
                Items
              </Typography>
              <Stack direction="row">
                <EditCart />
                {!userStore.groceryData?.checkoutDate && <DeleteCart />}
              </Stack>
            </Stack>

            <Typography variant="subtitle2" color="black">
              {userStore.groceryData?.storeName}
            </Typography>
            <Typography variant="subtitle2" color="black">
              {dayjs().format("MMMM D, YYYY, h:mm a")}
            </Typography>
            <Divider sx={{ my: 1, backgroundColor: "black" }} />

            {userStore.groceryData?.items?.length === 0 ? (
              <Typography variant="body1" color="black">
                No items in cart
              </Typography>
            ) : (
              userStore.groceryData?.items?.map((item) => {
                if (!item) return;
                return (
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
                        color: item.price == 0 ? "red" : "black",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {item.description}
                      </Typography>
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
                        color: item.price == 0 ? "red" : "black",
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
                        color: item.price == 0 ? "red" : "black",
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
                        color: item.price == 0 ? "red" : "black",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Typography variant="body1">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "PHP",
                        }).format(item.total)}
                      </Typography>
                      {item.price == 0 && (
                        <PriorityHigh sx={{ color: "red" }} />
                      )}
                    </Grid>
                  </Grid>
                );
              })
            )}

            <Divider sx={{ my: 1, backgroundColor: "black" }} />

            <Typography variant="body1" color="black">
              Item Count: {userStore.groceryData?.items?.length}
            </Typography>

            {userStore.groceryData?.checkoutDate && (
              <Typography
                variant="body1"
                color="success.main"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                ✓ Checked out on{" "}
                {dayjs(userStore.groceryData?.checkoutDate).format(
                  "MMMM D, YYYY, h:mm a"
                )}
              </Typography>
            )}
          </Paper>
          {!userStore.groceryData?.checkoutDate && <Footer />}
        </Box>
      </Box>
      <ShoppingListDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </>
  );
};

const GrandTotal = ({ groceryData }: { groceryData: Grocery | null }) => {
  const { grandTotal, isOverBudget } = useGrandTotals();
  const userStore = UserStore(); 

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Typography variant="body1" color="white" textAlign="left">
          Your Budget:
        </Typography>
        <Typography variant="body1" color="white" textAlign="left">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
          }).format(groceryData?.budget ?? 0)}
        </Typography>
      </Stack>
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
        {isOverBudget && !userStore.groceryData?.checkoutDate && (
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
    </>
  );
};

export const useGrandTotals = () => {
  const userStore = UserStore();
  const grandTotal =
    userStore.groceryData?.items?.reduce((acc, item) => acc + item?.total, 0) ??
    0;
  const isOverBudget =
    userStore.groceryData?.budget &&
    grandTotal > (userStore.groceryData?.budget ?? 0);
  return { grandTotal, isOverBudget };
};

export default MyCart;
