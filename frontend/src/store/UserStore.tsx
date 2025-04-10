import { create } from "zustand";
import { CartItem } from "../constants/Schema";



interface StoreState {
  grandTotal: number;
  setGrandTotal: (total: number) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  openAddModal: boolean;
  setOpenAddModal: (open: boolean) => void;
  barcode: string;
  setBarcode: (barcode: string) => void;
}

const UserStore = create<StoreState>((set) => ({
  grandTotal: 0,
  setGrandTotal: (total: number) => set({ grandTotal: total }),
  cartItems: [],
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
  openAddModal: false,
  setOpenAddModal: (open: boolean) => set({ openAddModal: open }),
  barcode: "",
  setBarcode: (barcode: string) => set({ barcode }),
}));

export default UserStore;
