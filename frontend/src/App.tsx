import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./utilities/routes";
import { getTheme } from "./utilities/theme";
import { SnackbarProvider } from "notistack";

function App() {
  const theme = getTheme();
  const createdTheme = createTheme(theme);
  const router = createBrowserRouter(routes);

  return (
    <ThemeProvider theme={createdTheme}>
      <SnackbarProvider />
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
