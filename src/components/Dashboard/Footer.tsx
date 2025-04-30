import { Fab, Stack, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import UserStore from "../../store/UserStore";
import AddModal from "./AddModal";
import CheckoutModal from "./CheckoutModal";

const StyledFab = styled(Stack)(({ theme }) => ({
  position: "fixed",
  zIndex: 1,
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  height: "auto",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 10,
}));

const Footer = () => {
  const userStore = UserStore();
  return (
    <>
      <StyledFab>
        <Fab
          aria-label="add"
          onClick={() => userStore.setOpenAddModal(true)}
          color="primary"
          disabled={Boolean(userStore.groceryData?.checkoutDate)}
        >
          <AddIcon />
        </Fab>
        <Fab
          aria-label="checkout"
          onClick={() => userStore.setOpenCheckoutModal(true)}
          color="primary"
          disabled={
            userStore.groceryData?.items?.length === 0 ||
            Boolean(userStore.groceryData?.checkoutDate)
          }
         
        >
          <ShoppingCartCheckoutIcon />
        </Fab>
      </StyledFab>
      <AddModal />
      <CheckoutModal />
    </>
  );
};

export default Footer;
