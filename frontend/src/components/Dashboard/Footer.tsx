import { Box, Fab, IconButton, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const StyledFab = styled(Fab)({
  position: "absolute",
  zIndex: 1,
  bottom: 10,
  right: 10,
  margin: "0 auto",
  backgroundColor: "secondary.main",
});

const Footer = () => {
  return (
    <StyledFab aria-label="add">
      <AddIcon />
    </StyledFab>
  );
};

export default Footer;
