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
  Chip,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import axios from "axios";
import Swal from "sweetalert2";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { GroceryItem } from "../../constants/Schema";

const API_URL = import.meta.env.VITE_API_URL;

// Interface for the shopping list item with quantity
interface ShoppingListItem extends GroceryItem {
  quantity: number;
}

// A separate card component so its hooks run consistently per item
interface ShoppingListItemCardProps {
  item: ShoppingListItem;
  onClick: (item: ShoppingListItem) => void;
  updateQuantity: (id: string, change: number) => void;
}
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
        }}
        onClick={() => onClick(item)}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>{item.quantity}</Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" fontWeight="medium" noWrap>
              {item.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              ₱{item.price.toFixed(2)} each
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
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
];

const ShoppingList = () => {
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

  // Fetch previous grocery items and shopping list on component mount
  useEffect(() => {
    fetchPreviousItems();
    fetchShoppingList();
    // Initialize suggestion when component mounts
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
      setShoppingList(response.data.data.items);
    } catch (error) {
      console.error("Error fetching shopping list:", error);
    } finally {
      setLoadingShoppingList(false);
    }
  };

  // Add item to shopping list
  const addToShoppingList = async (item: GroceryItem) => {
    try {
      await axios.post(`${API_URL}/shopping-list/add`, { itemId: item._id });

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
        Swal.fire({
          title: "Remove item?",
          text: `Remove ${updatedList[existingItemIndex].description} from your shopping list?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "var(--error-color)",
          cancelButtonColor: "var(--secondary-color)",
          confirmButtonText: "Yes, remove it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios.delete(`${API_URL}/shopping-list/remove/${itemId}`);
            setShoppingList(shoppingList.filter((item) => item._id !== itemId));
          }
        });
      } else {
        // Update quantity
        updatedList[existingItemIndex].quantity = newQuantity;
        setShoppingList(updatedList);
        await axios.patch(`${API_URL}/shopping-list/update/`, {
          items: updatedList,
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
        // Animation will happen via framer-motion
        setTimeout(() => showNextItem(), 300);
      }
    },
    onSwipedRight: () => {
      if (currentItem) {
        // Animation will happen via framer-motion
        setTimeout(() => {
          addToShoppingList(currentItem);
        }, 300);
      }
    },
    trackMouse: true,
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
            height: 300,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (!currentItem) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            p: 3,
          }}
        >
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
      <AnimatePresence>
        <motion.div
          key={currentItem._id}
          initial={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          {...suggestionSwipeHandlers}
        >
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

              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Chip
                  icon={<RemoveShoppingCartIcon />}
                  label="Swipe Left to Skip"
                  variant="outlined"
                  color="error"
                  size="small"
                />
                <Chip
                  icon={<AddShoppingCartIcon />}
                  label="Swipe Right to Add"
                  variant="outlined"
                  color="success"
                  size="small"
                />
              </Box> */}
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

    return (
      <Stack spacing={2} sx={{ mt: 2 }}>
        {shoppingList.map((item) => (
          <ShoppingListItemCard
            key={item._id}
            item={item}
            onClick={handleItemClick}
            updateQuantity={updateQuantity}
          />
        ))}
        <Divider sx={{mt: 2, bgcolor: "var(--primary-color)"}}/>
        <Typography variant="subtitle2" color="text.secondary" className="number-font">
          Total: ₱{shoppingList.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
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
              width: "90%",
              maxWidth: 400,
              p: 3,
              mx: "auto",
              borderRadius: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="bold">
                {selectedItem.description}
              </Typography>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body1">Price:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  ₱{selectedItem.price.toFixed(2)}
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
                  ₱{(selectedItem.price * selectedItem.quantity).toFixed(2)}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton
                  color="error"
                  onClick={() => {
                    setShowItemDetails(false);
                    // Show confirmation before deleting
                    Swal.fire({
                      title: "Remove item?",
                      text: `Remove ${selectedItem.description} from your shopping list?`,
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "var(--error-color)",
                      cancelButtonColor: "var(--secondary-color)",
                      confirmButtonText: "Yes, remove it!",
                    }).then(async (result) => {
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
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={() => setShowItemDetails(false)}>
                  Close
                </IconButton>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      </Box>
    );
  };

  // Main render
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ height: "100%", p: 2 }}
    >
      <Box sx={{ flex: { xs: "1", md: "1 1 60%" }, p: 1 }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, display: "flex", alignItems: "center" }}
        >
          <AddShoppingCartIcon sx={{ mr: 1 }} />
          Previous Grocery Items
        </Typography>

        {renderSuggestionCard()}
        <Typography variant="body2" color="text.secondary" sx={{fontSize: 10}}>
          Swipe left to skip, right to add to your shopping list
        </Typography>
      </Box>
      

      <Box sx={{ flex: { xs: "1", md: "1 1 40%" }, p: 1 }}>
        <Paper sx={{ p: 3,  borderRadius: 2 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, display: "flex", alignItems: "center" }}
          >
            <Badge
              badgeContent={shoppingList.length}
              color="primary"
              sx={{ ml: 1 }}
            >
              <ShoppingCartIcon sx={{ mr: 1 }} />
            </Badge>
            My Shopping List
          </Typography>

          {renderShoppingList()}
        </Paper>
      </Box>

      {renderItemDetailsModal()}
    </Stack>
  );
};

export default ShoppingList;
