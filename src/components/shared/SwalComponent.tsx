import Swal from "sweetalert2";

export const SwalComponent = Swal.mixin({
  confirmButtonColor: "var(--primary-color)",
  cancelButtonColor: "var(--secondary-color)",
  reverseButtons: true,
  buttonsStyling: true,
});
