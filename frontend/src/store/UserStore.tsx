import { create } from "zustand";
import { CartItem } from "../constants/Schema";



interface StoreState {
  grandTotal: number;
  setGrandTotal: (total: number) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}

const UserStore = create<StoreState>((set) => ({
  grandTotal: 0,
  setGrandTotal: (total: number) => set({ grandTotal: total }),
  cartItems: [],
  setCartItems: (items: CartItem[]) => set({ cartItems: items }),
}));

export default UserStore;
