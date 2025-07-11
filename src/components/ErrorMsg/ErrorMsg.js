import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { resetErrAction } from "../../redux/slices/globalActions/globalActions";
const ErrorMsg = ({ message, onConfirm }) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === "function") {
      onConfirm();
    }
  });
};

export default ErrorMsg;
