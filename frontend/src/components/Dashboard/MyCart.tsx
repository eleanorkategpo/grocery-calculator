import { Box, Divider, Paper, Typography } from "@mui/material";
import UserStore from "../../store/UserStore";
import dayjs from "dayjs";

const MyCart = () => {
  const userStore = UserStore();

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
      <GrandTotal />
      <Paper
        elevation={3}
        sx={{ padding: 2, borderRadius: 2, mt: 1, textAlign: "left" }}
        className="cutive-font"
      >
        <Typography variant="body1" color="black" my={1}>
          Items
        </Typography>

        <Typography variant="subtitle2" color="black">
          Somewhere in Davao City
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
            <Typography key={item.id} variant="body1">
              {item.name} - {item.price} - {item.quantity}
            </Typography>
          ))
        )}

        <Divider sx={{ my: 1, backgroundColor: "black" }} />

        <Typography variant="body1" color="black">
          Item Count: {userStore.cartItems.length}
        </Typography>
      </Paper>
    </Box>
  );
};

const GrandTotal = () => {
  const grandTotal = UserStore((state) => state.grandTotal);
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
      <Typography variant="h6" className="number-font" width="100%">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(grandTotal)}
      </Typography>
    </Box>
  );
};

export default MyCart;
