import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./utilities/routes";
import { getTheme } from "./utilities/theme";
import { SnackbarProvider } from "notistack";
import axios from "axios";

function App() {
  const theme = getTheme();
  const createdTheme = createTheme(theme);
  const router = createBrowserRouter(routes);

  axios.interceptors.request.use((config) => {
    if (!config.headers.Authorization) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  });

  return (
    <ThemeProvider theme={createdTheme}>
      <SnackbarProvider
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        maxSnack={3}
        autoHideDuration={2000}
      />
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
