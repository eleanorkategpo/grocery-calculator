import axios from "axios";
import { useNavigate } from "react-router-dom";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL;

interface ServiceStore {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  handleLogout: () => void;
  clearShoppingList: () => void;
}

const ServiceStore = create<ServiceStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  handleLogout: () => {
    const navigate = useNavigate();
    set({ isLoading: true });
    axios
      .get(`${API_URL}/auth/logout`)
      .then(() => {
        axios.defaults.headers.common["Authorization"] = null;
        localStorage.removeItem("user");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
    set({ isLoading: false });
  },
  clearShoppingList: () => {
    axios.post(`${API_URL}/shopping-list/clear`);
  },
}));

export default ServiceStore;
