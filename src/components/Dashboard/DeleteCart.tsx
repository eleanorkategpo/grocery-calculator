import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import UserStore from "../../store/UserStore";
import { enqueueSnackbar } from "notistack";
import { SweetAlertResult } from "sweetalert2";
import { SwalComponent } from "../shared/SwalComponent";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const DeleteCart = () => {
  const userStore = UserStore();
  const navigate = useNavigate();
  const handleDeleteCart = () => {
    SwalComponent.fire({
      title: "Are you sure?",
      text: "You are about to delete this cart. This action cannot be undone. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        await axios.delete(`${API_URL}/grocery/${userStore.groceryData?._id}`);
        enqueueSnackbar("Cart deleted successfully", {
          variant: "success",
        });
        navigate("/dashboard/previous-carts");
      }
    });
  };
  return (
    <>
      <IconButton color="error" onClick={handleDeleteCart}>
        <DeleteIcon />
      </IconButton>
    </>
  );
};

export default DeleteCart;
