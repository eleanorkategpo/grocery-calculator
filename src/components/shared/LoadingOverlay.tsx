import { Box, CircularProgress } from "@mui/material";
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
        <CircularProgress />
      </Box>
    )
  );
};

export default LoadingOverlay;
