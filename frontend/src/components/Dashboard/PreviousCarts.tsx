import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const PreviousCarts = () => {
  const [previousCarts, setPreviousCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousCarts = async () => {
      try {
        const response = await axios.get(`${API_URL}/grocery/previous-carts`);
        setPreviousCarts(response.data.data.previousCarts);
      } catch (error) {
        console.error("Error fetching previous carts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousCarts();
  }, []);

  return (
    <Box sx={{ padding: 2, overflowY: "auto", maxHeight: "80vh" }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {previousCarts.length == 0 ? (
            <Typography variant="h6" color="white">
              No previous carts found
            </Typography>
          ) : (
            previousCarts.map((cart) => (
              <Grid size={{ xs: 12 }} key={cart._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{cart.storeName}</Typography>
                    <Typography variant="body2">
                      Created on: {cart.createdAt}
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                      Total:{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "PHP",
                      }).format(cart.totalAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PreviousCarts;
