import { Fab, Stack, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UserStore from "../../store/UserStore";
import AddModal from "./AddModal";

const StyledFab = styled(Stack)(({ theme }) => ({
  position: "fixed",
  zIndex: 1,
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  height: "auto",
  margin: "0 auto",
  backgroundColor: theme.palette.secondary.main,
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
        >
          <AddIcon />
        </Fab>
      </StyledFab>
      <AddModal />
    </>
  );
};

export default Footer;
