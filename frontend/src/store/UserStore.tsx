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
}));

export default UserStore;
