import { useEffect, useState, useRef, TouchEvent } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress, Stack,
  Slide,
  IconButton,
  Divider
} from "@mui/material";
import Grid from "@mui/material/Grid";
import axios from "axios";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";

const API_URL = import.meta.env.VITE_API_URL;

const PreviousCarts = () => {
  const [previousCarts, setPreviousCarts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPreviousCarts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/grocery/previous-carts`);
      setPreviousCarts(response.data.data.previousCarts);
    } catch (error) {
      console.error("Error fetching previous carts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPreviousCarts();
  }, []);

  // Touch event handlers for pull-to-refresh
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    } else {
      startY.current = 0;
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (startY.current === 0) return;

    currentY.current = e.touches[0].clientY;
    const pullDistance = currentY.current - startY.current;

    if (pullDistance > 0) {
      // Prevent default to disable regular scrolling
      e.preventDefault();

      // Calculate pull progress (0-100)
      const newProgress = Math.min(100, (pullDistance / 100) * 100);
      setPullProgress(newProgress);
    }
  };

  const handleTouchEnd = () => {
    if (pullProgress > 70 && !refreshing) {
      // Trigger refresh if pulled enough
      setRefreshing(true);
      fetchPreviousCarts();
    }

    // Reset values
    startY.current = 0;
    currentY.current = 0;
    setPullProgress(0);
  };

  return (
    <Stack direction="column" spacing={2} sx={{ width: "100%", p: 2 }}>
      {/* Pull-to-refresh indicator */}
      {pullProgress > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: "60px",
            left: 0,
            right: 0,
            height: `${pullProgress}px`,
            maxHeight: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.paper",
            zIndex: 5,
            transition: "height 0.2s ease-out",
            overflow: "hidden",
            borderBottomLeftRadius: pullProgress > 50 ? 16 : 0,
            borderBottomRightRadius: pullProgress > 50 ? 16 : 0,
            backgroundColor: "primary.main",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              sx={{
                transform: `rotate(${pullProgress * 3.6}deg)`,
                transition: "transform 0.1s ease-out",
              }}
              size="small"
            >
              <RefreshIcon />
            </IconButton>
            <Typography variant="body2" color="white">
              {pullProgress > 70
                ? "Release to refresh"
                : "Pull down to refresh"}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Main content */}
      <Box
        ref={containerRef}
        sx={{
          overflowY: "auto",
          maxHeight: "80vh",
          touchAction: pullProgress > 0 ? "none" : "auto",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {refreshing && (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            py={2}
          >
            <CircularProgress size={24} />
            <Typography>Refreshing...</Typography>
          </Stack>
        )}

        {loading && !refreshing ? (
          <CircularProgress />
        ) : (
          <Grid
            container
            spacing={2}
            sx={{ maxWidth: "500px", margin: "0 auto" }}
          >
            {previousCarts.length === 0 ? (
              <Typography variant="h6" color="white">
                No previous carts found
              </Typography>
            ) : (
              previousCarts.map((cart, index) => (
                <Grid key={cart._id} size={{ xs: 12 }}>
                  <Slide
                    direction="up"
                    in={true}
                    mountOnEnter
                    timeout={300 + index * 100}
                  >
                    <Card
                      onClick={() => navigate(`/dashboard/${cart._id}/cart`)}
                      sx={{
                        cursor: "pointer",
                        transition:
                          "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6">{cart.storeName}</Typography>
                        <Typography variant="body2" color="">
                          Created on:{" "}
                          {dayjs(cart.createdAt).format("DD/MM/YYYY hh:mm A")}
                        </Typography>
                        <Typography variant="body2">
                          ✓ Checked out on:{" "}
                          {dayjs(cart.checkoutDate).format(
                            "DD/MM/YYYY hh:mm A"
                          )}
                        </Typography>
                        <Divider
                          sx={{
                            my: 1,
                            backgroundColor: "var(--primary-color)",
                          }}
                        />
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Typography variant="subtitle2" color="primary">
                            No of Items: {cart.items?.length}
                          </Typography>
                          <Typography variant="subtitle2" color="primary">
                            Total:{" "}
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "PHP",
                            }).format(cart.totalAmount)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Slide>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};

export default PreviousCarts;
