import LoadingGif from "../../assets/checkout-loading.gif";
import { Box } from "@mui/material";
const LoadingOverlay = ({ loading }: { loading: boolean }) => {
  return (
    loading && (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
      >
        <img src={LoadingGif} alt="loading" width="150px" height="150px" />
      </Box>
    )
  );
};

export default LoadingOverlay;
