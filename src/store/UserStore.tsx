import { create } from "zustand";
import { Grocery, GroceryItem } from "../constants/Schema";

interface StoreState {
  openAddModal: boolean;
  setOpenAddModal: (open: boolean) => void;
  barcode: string;
  setBarcode: (barcode: string) => void;
  groceryData: Grocery | null;
  setGroceryData: (groceryData: Grocery | null) => void;
  openCheckoutModal: boolean;
  setOpenCheckoutModal: (open: boolean) => void;
  openEditCartModal: boolean;
  setOpenEditCartModal: (open: boolean) => void;
  editItem: GroceryItem | null;
  setEditItem: (item: GroceryItem | null) => void;
  shoppingListDrawerOpen: boolean;
  setShoppingListDrawerOpen: (open: boolean) => void;
  showInstructions: boolean;
  setShowInstructions: (show: boolean) => void;
}

const UserStore = create<StoreState>((set) => ({
  openAddModal: false,
  setOpenAddModal: (open: boolean) => set({ openAddModal: open }),
  barcode: "",
  setBarcode: (barcode: string) => set({ barcode }),
  groceryData: null,
  setGroceryData: (groceryData: Grocery | null) => set({ groceryData }),
  openCheckoutModal: false,
  setOpenCheckoutModal: (open: boolean) => set({ openCheckoutModal: open }),
  openEditCartModal: false,
  setOpenEditCartModal: (open: boolean) => set({ openEditCartModal: open }),
  editItem: null,
  setEditItem: (item: GroceryItem | null) => set({ editItem: item }),
  shoppingListDrawerOpen: false,
  setShoppingListDrawerOpen: (open: boolean) => set({ shoppingListDrawerOpen: open }),
  showInstructions: true,
  setShowInstructions: (show: boolean) => set({ showInstructions: show }),
}));

export default UserStore;
