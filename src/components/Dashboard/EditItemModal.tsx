import { useEffect } from "react";
import UserStore from "../../store/UserStore";
import { GroceryItem } from "../../constants/Schema";

interface EditItemProps {
  item: GroceryItem | null;
  onClose: () => void;
  isOpen: boolean;
}

/**
 * Component for editing a specific item that reuses AddModal
 * This component manages the state coordination between EditCart and AddModal
 */
const EditItemModal = ({ item, onClose, isOpen }: EditItemProps) => {
  const userStore = UserStore();
  
  // Set edit item in store when component opens
  useEffect(() => {
    if (item && isOpen) {
      userStore.setEditItem(item);
      userStore.setOpenAddModal(true);
    } else if (!isOpen) {
      // Only clear edit item when not open
      userStore.setEditItem(null);
      userStore.setOpenAddModal(false);
    }
  }, [item, isOpen]);
  
  // Listen for AddModal close event
  useEffect(() => {
    if (!userStore.openAddModal && isOpen) {
      // If AddModal closed but we're still "open", call onClose
      onClose();
    }
  }, [userStore.openAddModal, isOpen, onClose]);
  
  return null; // AddModal is rendered elsewhere
};

export default EditItemModal; 