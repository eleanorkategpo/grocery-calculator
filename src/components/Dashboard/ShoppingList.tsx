import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Stack,
  Box,
  Divider,
  IconButton,
  Badge,
  CircularProgress,
  Avatar,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useSwipeable } from "react-swipeable";
import axios from "axios";
import { SweetAlertResult } from "sweetalert2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { GroceryItem } from "../../constants/Schema";
import CloseIcon from "@mui/icons-material/Close";
import { Add, DeleteForever, DoNotTouch } from "@mui/icons-material";
import { SwalComponent } from "../shared/SwalComponent";
import UserStore from "../../store/UserStore";
import SwipeLeftIcon from "@mui/icons-material/SwipeLeft";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import SwipeIcon from "@mui/icons-material/Swipe";

const API_URL = import.meta.env.VITE_API_URL;

// Changed from interface to type
type ShoppingListItem = GroceryItem & {
  quantity: number;
};

// Changed from interface to type
type ShoppingListItemCardProps = {
  item: ShoppingListItem;
  onClick: (item: ShoppingListItem) => void;
  updateQuantity: (id: string, change: number) => void;
};

const ShoppingListItemCard = ({
  item,
  onClick,
  updateQuantity,
}: ShoppingListItemCardProps) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => updateQuantity(item._id, -1),
    onSwipedRight: () => updateQuantity(item._id, 1),
    trackMouse: true,
  });

  return (
    <motion.div whileHover={{ scale: 1.02 }} {...handlers}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          cursor: "grab",
          "&:hover": { boxShadow: 3 },
          transition: "box-shadow 0.3s",
          width: "100%",
        }}
        onClick={() => onClick(item)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(item._id, -1);
            }}
          >
            <RemoveIcon />
          </IconButton>
          <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
            {item.quantity ?? 1}{" "}
            <span style={{ fontSize: 12 }}>{item.unit}</span>
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="medium">
              {item.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              ₱{item.price?.toFixed(2)} each
            </Typography>
          </Box>

          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(item._id, 1);
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Paper>
    </motion.div>
  );
};

// Restock suggestion options
const suggestionMessages: string[] = [
  "Is it time to restock?",
  "Are you running low on...",
  "Need to replenish stock?",
  "Don't forget to refill?",
  "Looks like you need to restock...",
  "Time to restock your pantry!",
  "Is it time to restock?",
];

const ShoppingList = () => {
  const userStore = UserStore();
  const showInstructions = userStore.showInstructions;
  const setShowInstructions = userStore.setShowInstructions;

  // State for previous items to consider adding
  const [previousItems, setPreviousItems] = useState<GroceryItem[]>([]);
  // Randomized suggestion prompt
  const [suggestionPrompt, setSuggestionPrompt] = useState<string>(
    suggestionMessages[0]
  );
  const [currentItem, setCurrentItem] = useState<GroceryItem | null>(null);
  const [loadingPrevious, setLoadingPrevious] = useState(true);

  // State for shopping list items
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [loadingShoppingList, setLoadingShoppingList] = useState(true);

  // State for item detail modal
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(
    null
  );
  const [showItemDetails, setShowItemDetails] = useState(false);

  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Add state for swipe direction animation
  const [swipeDirection, setSwipeDirection] = useState<
    "none" | "left" | "right"
  >("none");
  const [isHolding, setIsHolding] = useState(false);
  const xPosition = useMotionValue(0);
  const deleteIconOpacity = useTransform(xPosition, [-150, -1], [1, 0]);
  const cartIconOpacity = useTransform(xPosition, [1, 150], [0, 1]);
  const cardRotation = useTransform(xPosition, [-200, 0, 200], [-10, 0, 10]);
  const cardScale = useTransform(
    xPosition,
    [-200, -100, 0, 100, 200],
    [0.8, 0.9, 1, 0.9, 0.8]
  );

  useEffect(() => {
    setLoadingPrevious(true);
    setLoadingShoppingList(true);
    fetchPreviousItems();
    fetchShoppingList();
    if (currentItem) {
      const idx = Math.floor(Math.random() * suggestionMessages.length);
      setSuggestionPrompt(suggestionMessages[idx]);
    }
  }, []);
  // Update suggestion whenever the current item changes
  useEffect(() => {
    if (currentItem) {
      const idx = Math.floor(Math.random() * suggestionMessages.length);
      setSuggestionPrompt(suggestionMessages[idx]);
    }
  }, [currentItem]);

  // Fetch previous grocery items
  const fetchPreviousItems = async () => {
    try {
      setLoadingPrevious(true);
      const response = await axios.get(`${API_URL}/grocery/last-grocery-items`);
      // filter already in shopping list
      const items = response.data.data.lastGroceryItems;
      setPreviousItems(items);
      if (items.length > 0) {
        setCurrentItem(items[0]);
      }
    } catch (error) {
      console.error("Error fetching previous items:", error);
    } finally {
      setLoadingPrevious(false);
    }
  };

  // Fetch shopping list
  const fetchShoppingList = async () => {
    try {
      setLoadingShoppingList(true);
      const response = await axios.get(`${API_URL}/shopping-list`);
      setShoppingList(response.data.data.items ?? []);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    } finally {
      setLoadingShoppingList(false);
    }
  };

  // Add item to shopping list
  const addToShoppingList = async (item: GroceryItem) => {
    try {
      await axios.post(`${API_URL}/shopping-list/add`, {
        groceryItemId: item._id,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      });

      // Update local state - either add new item or increase quantity
      const existingItemIndex = shoppingList.findIndex(
        (i) => i._id === item._id
      );

      if (existingItemIndex >= 0) {
        const updatedList = [...shoppingList];
        updatedList[existingItemIndex].quantity += 1;
        setShoppingList(updatedList);
      } else {
        setShoppingList([...shoppingList, { ...item, quantity: 1 }]);
      }

      showNextItem();
    } catch (error) {
      console.error("Error adding item to shopping list:", error);
    }
  };

  // Update quantity in shopping list
  const updateQuantity = async (itemId: string, change: number) => {
    try {
      const existingItemIndex = shoppingList.findIndex((i) => i._id === itemId);
      if (existingItemIndex < 0) return;

      const updatedList = [...shoppingList];
      const newQuantity = updatedList[existingItemIndex].quantity + change;

      if (newQuantity <= 0) {
        // Confirm before removing
        SwalComponent.fire({
          title: "Remove item?",
          text: `Remove ${updatedList[existingItemIndex].description} from your shopping list?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, remove it!",
        }).then(async (result: SweetAlertResult) => {
          if (result.isConfirmed) {
            await axios.delete(`${API_URL}/shopping-list/remove/${itemId}`);
            setShoppingList(shoppingList.filter((item) => item._id !== itemId));
            fetchPreviousItems();
          }
        });
      } else {
        // Update quantity
        updatedList[existingItemIndex].quantity = newQuantity;
        setShoppingList(updatedList);
        await axios.patch(`${API_URL}/shopping-list/update-item/${itemId}`, {
          groceryItemId: itemId,
          description: updatedList[existingItemIndex].description,
          quantity: newQuantity,
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Show next item in the swipe deck
  const showNextItem = () => {
    const currentIndex = previousItems.findIndex(
      (item) => item._id === currentItem?._id
    );
    if (currentIndex < previousItems.length - 1) {
      setCurrentItem(previousItems[currentIndex + 1]);
    } else {
      setCurrentItem(null);
    }
  };

  // Swipe handlers for the suggestion card
  const suggestionSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentItem) {
        setSwipeDirection("left");
        // Animation will happen via framer-motion
        setTimeout(() => {
          showNextItem();
          setSwipeDirection("none");
        }, 300);
      }
    },
    onSwipedRight: () => {
      if (currentItem) {
        setSwipeDirection("right");
        // Animation will happen via framer-motion
        setTimeout(() => {
          addToShoppingList(currentItem);
          setSwipeDirection("none");
        }, 300);
      }
    },
    onSwiping: (e) => {
      xPosition.set(e.deltaX);
      if (Math.abs(e.deltaX) > 20) {
        setIsHolding(true);
        // Prevent scrolling when swiping
        document.body.style.overflow = "hidden";
      }
    },
    onSwiped: () => {
      setIsHolding(false);
      // Re-enable scrolling after swipe is complete
      document.body.style.overflow = "";
    },
    trackMouse: true,
    preventScrollOnSwipe: true, // Add this to prevent scrolling during swipe
  });

  // Handle item click to show details
  const handleItemClick = (item: ShoppingListItem) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };

  // Render suggestion card
  const renderSuggestionCard = () => {
    if (loadingPrevious) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: { xs: 150, md: 200 },
            width: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!currentItem) {
      return (
        <Box sx={{ width: "100%", textAlign: "center", p: 2 }}>
          <Typography variant="h6" gutterBottom>
            No more items to suggest
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We've gone through all your previous purchases.
          </Typography>
        </Box>
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem._id}
          initial={{ x: 0, opacity: 1 }}
          animate={{
            x:
              swipeDirection === "left"
                ? -300
                : swipeDirection === "right"
                ? 300
                : 0,
            opacity: swipeDirection === "none" ? 1 : 0,
            rotate:
              swipeDirection === "none"
                ? 0
                : swipeDirection === "left"
                ? -10
                : 10,
            scale: swipeDirection === "none" ? 1 : 0.8,
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          exit={{
            x: swipeDirection === "left" ? -500 : 500,
            opacity: 0,
            transition: { duration: 0.3 },
          }}
          style={{
            x: xPosition,
            rotate: cardRotation,
            scale: cardScale,
            position: "relative",
            width: "100%",
          }}
          {...suggestionSwipeHandlers}
        >
          {isHolding && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* Delete icon (appears when swiping left) */}
              <Box
                component={motion.div}
                style={{
                  opacity: deleteIconOpacity,
                }}
              >
                <DoNotTouch
                  sx={{
                    fontSize: 100,
                    color: "var(--error-color)",
                  }}
                />
              </Box>

              {/* Cart icon (appears when swiping right) */}
              <Box
                component={motion.div}
                style={{
                  opacity: cartIconOpacity,
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    fontSize: 100,
                    color: "var(--success-color)",
                  }}
                />
              </Box>
            </Box>
          )}

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 2,
              maxWidth: 400,
              mx: "auto",
              cursor: "grab",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
              transition: "all 0.3s",
              backgroundColor: isHolding
                ? xPosition.get() < -20
                  ? "rgba(255, 200, 200, 0.2)"
                  : xPosition.get() > 20
                  ? "rgba(200, 255, 200, 0.2)"
                  : "white"
                : "white",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 4,
                background:
                  "linear-gradient(90deg, var(--error-color) 50%, var(--primary-color) 50%)",
              },
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">{suggestionPrompt}</Typography>

              <Typography variant="h5" fontWeight="bold">
                {currentItem.description}
              </Typography>
            </Stack>
          </Paper>
        </motion.div>
      </AnimatePresence>
    );
  };

  // Render shopping list
  const renderShoppingList = () => {
    if (loadingShoppingList) {
      return <CircularProgress />;
    }

    if (shoppingList.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary">
          Your shopping list is empty
        </Typography>
      );
    }
    const handleClearList = () => {
      SwalComponent.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post(`${API_URL}/shopping-list/clear`);
          fetchPreviousItems();
        }
      });
    };

    return (
      <Stack spacing={2} sx={{ overflow: "auto" }}>
        {shoppingList.length > 0 && (
          <Button
            variant="contained"
            sx={{ color: "white", bgcolor: "var(--error-color)" }}
            onClick={handleClearList}
          >
            <DeleteForever sx={{ mr: 1, color: "white" }} />
            Clear List
          </Button>
        )}
        {shoppingList.map((item) => (
          <ShoppingListItemCard
            key={item._id}
            item={item}
            onClick={handleItemClick}
            updateQuantity={updateQuantity}
          />
        ))}
        <Divider sx={{ mt: 2, bgcolor: "var(--primary-color)" }} />
        <Typography
          variant="subtitle2"
          color="text.secondary"
          className="number-font"
        >
          Estimated Total: ₱
          {shoppingList
            .reduce(
              (acc, item) => acc + (item.price ?? 0) * (item.quantity ?? 1),
              0
            )
            ?.toFixed(2)}
        </Typography>
      </Stack>
    );
  };

  // Render item details modal
  const renderItemDetailsModal = () => {
    if (!selectedItem || !showItemDetails) return null;

    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setShowItemDetails(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Paper
            sx={{
              width: "90vw",
              maxWidth: 400,
              p: 3,
              mx: "auto",
              borderRadius: 2,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stack spacing={3}>
              <Button
                onClick={() => setShowItemDetails(false)}
                sx={{ position: "absolute", top: 20, right: 0 }}
              >
                <CloseIcon />
              </Button>

              <Typography variant="h5" fontWeight="bold">
                {selectedItem.description}
              </Typography>

              <Divider sx={{ bgcolor: "var(--primary-color)" }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">Price:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₱{selectedItem.price?.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">Quantity:</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => updateQuantity(selectedItem._id, -1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body1" fontWeight="bold" sx={{ mx: 2 }}>
                    {selectedItem.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => updateQuantity(selectedItem._id, 1)}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">Total:</Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  ₱{(selectedItem.price * selectedItem.quantity)?.toFixed(2)}
                </Typography>
              </Box>

              <Divider sx={{ bgcolor: "var(--primary-color)" }} />

              <Button
                variant="contained"
                onClick={() => {
                  setShowItemDetails(false);
                  // Show confirmation before deleting
                  SwalComponent.fire({
                    title: "Remove item?",
                    text: `Remove ${selectedItem.description} from your shopping list?`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, remove it!",
                  }).then(async (result: SweetAlertResult) => {
                    if (result.isConfirmed) {
                      await axios.delete(
                        `${API_URL}/shopping-list/remove/${selectedItem._id}`
                      );
                      setShoppingList(
                        shoppingList.filter(
                          (item) => item._id !== selectedItem._id
                        )
                      );
                    }
                  });
                }}
                sx={{
                  bgcolor: "var(--error-color)",
                  color: "white",
                }}
              >
                <RemoveShoppingCartIcon />
                Remove from List
              </Button>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    );
  };

  const Instructions = () => {
    return (
      <Stack
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000,
          bgcolor: "rgba(0, 0, 0, 0.85)",
          p: { xs: 2, sm: 4 },
        }}
        alignItems="center"
        justifyContent="center"
        gap={3}
        onClick={() => setShowInstructions(false)}
      >
        <Paper
          elevation={6}
          sx={{
            maxWidth: 500,
            width: "100%",
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            color="primary"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
          >
            How to Use Your Shopping List
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              When Adding Items:
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SwipeLeftIcon color="error" />
                <Typography variant="body1">
                  Swipe LEFT to SKIP an item
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SwipeRightIcon color="success" />
                <Typography variant="body1">
                  Swipe RIGHT to ADD to your list
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              In Your Shopping List:
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <SwipeIcon color="primary" />
                <Typography variant="body1">
                  Swipe LEFT or RIGHT to adjust quantity
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TouchAppIcon color="info" />
                <Typography variant="body1">
                  TAP an item to view details
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowInstructions(false);
              }}
            >
              Got it!
            </Button>
          </Box>
        </Paper>
      </Stack>
    );
  };

   const [newItemDescription, setNewItemDescription] = useState("");
   const [newItemPrice, setNewItemPrice] = useState<number | null>(null);

  const handleAddItem = (description: string, price: number | null) => {
    axios
      .post(`${API_URL}/shopping-list/add`, {
        description,
        quantity: 1,
        price: price ?? 0,
      })
      .then((res) => {
        if (res.status === 200) {
          setShowAddItemModal(false);
          fetchShoppingList();
          setNewItemDescription("");
          setNewItemPrice(0);
        }
      });
  };
 
  const renderAddItemModal = () => {
    return (
      <Dialog
        open={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false);
          setNewItemDescription("");
          setNewItemPrice(0);
        }}
      >
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} direction="column" mt={1}>
            <TextField
              label="Item Description"
              fullWidth
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              variant="outlined"
            />

            {/* Price */}
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={newItemPrice}
              onChange={(e) => {
                const value = e.target.value.replace(/^0+/, ""); // Remove leading zeros
                setNewItemPrice(value ? Number(value) : null); // Convert to number or set to empty string
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₱</InputAdornment>
                ),
              }}
            />

            {/* Add button */}
            <Button
              variant="contained"
              disabled={!newItemDescription}
              onClick={() =>
                handleAddItem(newItemDescription, newItemPrice ?? 0)
              }
              sx={{ color: "white", bgcolor: "var(--success-color)" }}
            >
              <Add />
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    );
  };

  // Main render
  return (
    <>
      {/* Instructions Overlay */}
      {showInstructions && <Instructions />}

      {/* Underlying Dashboard */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1, md: 2 }}
        sx={{
          width: "100%",
          height: "100%",
          p: { xs: 1, md: 2 },
          overflow: "auto",
        }}
      >
        {/* <LoadingOverlay loading={loadingPrevious || loadingShoppingList} /> */}
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          sx={{ width: "100%", height: "100%" }}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              minHeight: { xs: "180px", md: "auto" },
              p: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: { xs: 1, md: 3 },
                display: "flex",
                alignItems: "center",
                width: "100%",
              }}
            >
              <AddShoppingCartIcon sx={{ mr: 1 }} />
              Previous Grocery Items
            </Typography>

            {renderSuggestionCard()}
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              height: { xs: "calc(70vh - 16px)", md: "100%" },
              p: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                minHeight: "180px",
                height: "fit-content",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Badge
                    badgeContent={shoppingList.length}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <ShoppingCartIcon sx={{ mr: 1 }} />
                  </Badge>
                  My Shopping List
                </Typography>
                <IconButton onClick={() => setShowAddItemModal(true)}>
                  <AddShoppingCartIcon sx={{ color: "var(--success-color)" }} />
                </IconButton>
              </Stack>

              <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {renderShoppingList()}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {renderItemDetailsModal()}
        {renderAddItemModal()}
      </Stack>
    </>
  );
};

export default ShoppingList;
