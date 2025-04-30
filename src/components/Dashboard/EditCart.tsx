import { useState } from "react";
import {
  IconButton,
  Modal,
  Paper,
  Stack,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserStore from "../../store/UserStore";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { GroceryItem } from "../../constants/Schema";
import EditItemModal from "./EditItemModal";

const API_URL = import.meta.env.VITE_API_URL;

const EditCart = () => {
  const userStore = UserStore();
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleItemEdit = (item: GroceryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleItemDelete = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/grocery/item/${itemId}`);

      // Update local state by removing the deleted item
      if (userStore.groceryData) {
        const filteredItems = userStore.groceryData.items.filter(
          (item) => item && item._id !== itemId
        );
        
        userStore.setGroceryData({
          ...userStore.groceryData,
          items: filteredItems,
        });
      }

      enqueueSnackbar("Item deleted successfully", { variant: "success" });
    } catch (error) {
      console.error("Error deleting item:", error);
      enqueueSnackbar("Failed to delete item", { variant: "error" });
    }
  };

  const handleEditClose = () => {
    setSelectedItem(null);
    setIsEditModalOpen(false);
  };

  // Calculate total amount safely
  const calculateTotal = () => {
    if (!userStore.groceryData?.items) return 0;
    
    return userStore.groceryData.items
      .filter(item => item) // Filter out any null/undefined items
      .reduce((sum, item) => sum + (item.total || 0), 0);
  };

  return (
    <>
      {!userStore.groceryData?.checkoutDate && (
        <IconButton onClick={() => userStore.setOpenEditCartModal(true)}>
          <EditIcon color="primary" />
        </IconButton>
      )}

      <Modal
        open={userStore.openEditCartModal}
        onClose={() => userStore.setOpenEditCartModal(false)}
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Edit Cart Items</Typography>
            <IconButton onClick={() => userStore.setOpenEditCartModal(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider sx={{ backgroundColor: "black" }} />

          <Box sx={{ overflow: "auto", flex: 1 }}>
            {userStore.groceryData?.items &&
            userStore.groceryData.items.filter(Boolean).length > 0 ? (
              <List>
                {userStore.groceryData.items.map((item) => {
                  if (!item) return null;
                  return (
                    <Box key={item._id}>
                      <ListItem>
                        <ListItemText
                          primary={item.description}
                          secondary={`Qty: ${item.quantity} ${
                            item.unit
                          } - ₱${item.price.toFixed(2)} each`}
                        />
                        <ListItemSecondaryAction>
                          <Stack direction="row" spacing={1}>
                            <IconButton
                              edge="end"
                              onClick={() => handleItemEdit(item)}
                            >
                              <EditIcon color="primary" />
                            </IconButton>
                            <IconButton
                              edge="end"
                              onClick={() => handleItemDelete(item._id)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Stack>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider />
                    </Box>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                No items in cart
              </Typography>
            )}
          </Box>
          <Divider sx={{ backgroundColor: "black" }} />

          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Typography variant="h6">
              Total: ₱{calculateTotal().toFixed(2)}
            </Typography>
          </Stack>
        </Paper>
      </Modal>

      <EditItemModal
        item={selectedItem}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
      />
    </>
  );
};

export default EditCart;
