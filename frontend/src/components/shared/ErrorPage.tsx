// frontend/src/components/ErrorPage.tsx
import { Box, Typography } from "@mui/material";

const ErrorPage = () => {
  return (
    <Box>
      <Typography variant="h4">Oops! Something went wrong.</Typography>
      <Typography variant="body1">
        The page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default ErrorPage;
