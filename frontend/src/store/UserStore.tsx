import { create } from "zustand";
import { GroceryItem } from "../constants/Schema";

interface StoreState {
  openAddModal: boolean;
  setOpenAddModal: (open: boolean) => void;
  barcode: string;
  setBarcode: (barcode: string) => void;
  cartItems: GroceryItem[];
  setCartItems: (items: GroceryItem[]) => void;
}

const UserStore = create<StoreState>((set) => ({
  openAddModal: false,
  setOpenAddModal: (open: boolean) => set({ openAddModal: open }),
  barcode: "",
  setBarcode: (barcode: string) => set({ barcode }),
  cartItems: [],
  setCartItems: (items: GroceryItem[]) => set({ cartItems: items }),
}));

export default UserStore;
