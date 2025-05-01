import { useState, useMemo } from "react";
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
import { PriorityHigh } from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

const EditCart = () => {
  const userStore = UserStore();
  const [selectedItem, setSelectedItem] = useState<GroceryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1) Create a memoized, filtered & sorted array:
  const sortedItems = useMemo<GroceryItem[]>(() => {
    const items = userStore.groceryData?.items ?? [];
    return items
      .filter((item): item is GroceryItem => Boolean(item))
      .sort((a, b) => {
        const aFree = a.price === 0;
        const bFree = b.price === 0;
        if (aFree && !bFree) return -1;
        if (!aFree && bFree) return 1;
        return a.description.localeCompare(b.description);
      });
  }, [userStore.groceryData?.items]);

  const handleItemEdit = (item: GroceryItem) => {
    setIsEditModalOpen(false);
    userStore.setOpenAddModal(true);
    userStore.setEditItem(item);
  };

  const handleItemDelete = async (itemId: string) => {
    try {
      axios.delete(`${API_URL}/grocery/item/${itemId}`).then((res) => {
        if (res.status === 204) {
          if (userStore.groceryData) {
            userStore.setGroceryData({
              ...userStore.groceryData,
              items: userStore.groceryData.items.filter(
                (it) => it && it._id !== itemId
              ),
            });
          }
          enqueueSnackbar("Item deleted successfully", { variant: "success" });
        }
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      enqueueSnackbar("Failed to delete item", { variant: "error" });
    }
  };

  const handleEditClose = () => {
    setSelectedItem(null);
    setIsEditModalOpen(false);
  };

  const calculateTotal = () => {
    return (userStore.groceryData?.items ?? [])
      .filter((item): item is GroceryItem => Boolean(item))
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
            p: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "90%",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Edit Cart Items</Typography>
            <IconButton onClick={() => userStore.setOpenEditCartModal(false)}>
              <CloseIcon sx={{ color: "black" }} />
            </IconButton>
          </Stack>

          <Divider sx={{ backgroundColor: "black" }} />

          <Box sx={{ overflow: "auto" }}>
            {sortedItems.length > 0 ? (
              <List>
                {sortedItems.map((item) => (
                  <Box key={item._id}>
                    <ListItem sx={{ p: 0 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            noWrap
                            color={item.price == 0 ? "red" : "black"}
                          >
                            {item.description}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            sx={{ color: item.price == 0 ? "red" : "black" }}
                          >
                            Qty: {item.quantity} {item.unit} - ₱
                            {item.price?.toFixed(2)} each
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Stack direction="row" gap={1} alignItems="center">
                          {item.price == 0 && (
                            <PriorityHigh sx={{ color: "red" }} />
                          )}
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
                ))}
              </List>
            ) : (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                height="100%"
                my={4}
              >
                <Typography variant="body1" align="center">
                  No items in cart
                </Typography>
              </Stack>
            )}
          </Box>

          <Divider sx={{ backgroundColor: "black" }} />

          <Stack direction="row" justifyContent="flex-end" mt={2}>
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
