import Swal from "sweetalert2";

const SuccessMsg = ({ message, onConfirm  }) => {
  Swal.fire({
    icon: "success",
    title: "Good job!",
    text: message,
  }).then((result) => {
    if (result.isConfirmed && typeof onConfirm === "function") {
      onConfirm();
    }
  });
};

export default SuccessMsg;
