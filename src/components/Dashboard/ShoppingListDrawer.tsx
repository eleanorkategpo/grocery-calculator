import React, { useEffect, useState } from "react";
import {
  Box,
  SwipeableDrawer,
  Typography,
  Stack,
  Checkbox, useTheme,
  styled,
  IconButton
} from "@mui/material";
import { useSwipeable } from "react-swipeable";
import SwipeLeft from "../../assets/swipeleft.gif";
import { ShoppingListItems } from "../../constants/Schema";
import UserStore from "../../store/UserStore";
import axios from "axios";
import ServiceStore from "../../store/ServiceStore";
import { DeleteForever } from "@mui/icons-material";
import { SwalComponent } from "../shared/SwalComponent";
import LoadingOverlay from "../shared/LoadingOverlay";
const API_URL = import.meta.env.VITE_API_URL;

const SwipeArea = styled("div")(({ theme }) => ({
  position: "fixed",
  right: 0,
  top: 0,
  bottom: 0,
  width: 20, // Swipe area width
  zIndex: theme.zIndex.drawer - 1,
}));

const ShoppingListDrawer = ({
  drawerOpen,
  setDrawerOpen,
}: {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}) => {
  const userStore = UserStore();
  const serviceStore = ServiceStore();
  const showInstructions = userStore.showInstructions;
  const setShowInstructions = userStore.setShowInstructions;
  const [fetching, setFetching] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItems[]>([]);
  const theme = useTheme();

  const handlers = useSwipeable({
    onSwipedLeft: () => setDrawerOpen(true),
    delta: 50, // minimum px distance for a swipe
    trackTouch: true,
    trackMouse: true,
  });

  // toggleDrawer helper
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      // ignore tab/shift key presses
      if (
        event?.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const fetchShoppingList = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${API_URL}/shopping-list`);
      setShoppingList(response.data.data.items ?? []);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowInstructions(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      fetchShoppingList();
    }
  }, [drawerOpen]);

  const instructions = showInstructions && (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <img src={SwipeLeft} width={100} alt="Swipe left" />
      <Typography variant="h6">
        Swipe left to open your shopping list
      </Typography>
    </Box>
  );

  const handleCheckboxChange = async (itemId: string, checked: boolean) => {
    try {
      const response = await axios.patch(
        `${API_URL}/shopping-list/update-item/${itemId}`,
        {
          checked,
        }
      );
      if (response.status === 200) {
        setShoppingList(
          shoppingList.map((item) =>
            item._id === itemId ? { ...item, checked } : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating shopping list:", error);
    }
  };

  const handleClearShoppingList = (e: React.MouseEvent) => {
    SwalComponent.fire({
      title: "Clear Shopping List?",
      text: "This action will remove all items from your shopping list. Are you sure you want to proceed?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        e.stopPropagation();
        serviceStore.clearShoppingList();
      }
    });
  };

  return (
    <>
      {instructions}
      <LoadingOverlay loading={fetching} />
      <SwipeArea {...handlers} />
      <SwipeableDrawer
        anchor="right"
        open={drawerOpen}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}
        disableScrollLock={false}
        swipeAreaWidth={20}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "80%", sm: 300 },
            position: "fixed",
            height: "100%",
            zIndex: (theme) => theme.zIndex.drawer,
          },
        }}
      >
        <Stack
          sx={{
            height: "100%",
            overflow: "auto",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
          p={2}
          spacing={1}
          direction="column"
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Shopping List</Typography>
            <IconButton onClick={(e) => handleClearShoppingList(e)}>
              <DeleteForever sx={{ color: "red" }} />
            </IconButton>
          </Stack>
          {shoppingList.length > 0 ? (
            shoppingList.map((item) => (
              <Stack
                key={item._id}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  position: "relative",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={item.checked}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleCheckboxChange(item._id, e.target.checked)
                  }
                />
                <Typography
                  variant="body1"
                  className="cutive-font"
                  sx={{
                    color: item.checked
                      ? theme.palette.text.disabled
                      : theme.palette.text.primary,
                    position: "relative",
                    ...(item.checked && {
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: 0,
                        height: "3px",
                        width: "100%",
                        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 5' width='100' height='5'%3E%3Cpath d='M0,2.5 C10,1.2 20,3.8 30,2.5 C40,1.2 50,3.8 60,2.5 C70,1.2 80,3.8 90,2.5 C100,1.2' fill='none' stroke='${encodeURIComponent(
                          theme.palette.text.disabled
                        )}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") repeat-x`,
                        backgroundSize: "40px 100%",
                        transform: "translateY(-50%)",
                        transformOrigin: "left",
                        animation: "pencilStroke 0.6s ease-out forwards",
                      },
                    }),
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.description} {item.quantity > 1 && `(${item.quantity})`}
                </Typography>
              </Stack>
            ))
          ) : (
            <Typography variant="body1">
              No items in your shopping list
            </Typography>
          )}
        </Stack>
      </SwipeableDrawer>

      <Box
        sx={{
          "@keyframes pencilStroke": {
            "0%": { width: "0%", opacity: 0.7 },
            "30%": { opacity: 0.8 },
            "100%": { width: "100%", opacity: 1 },
          },
        }}
      />
    </>
  );
};

export default ShoppingListDrawer;
