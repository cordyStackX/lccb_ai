import Swal from 'sweetalert2';

export default function SweetAlert2(
  title,
  text,
  icon,
  showConfirmButton = false,
  showLoading = false
) {
  Swal.fire({
    title,
    text,
    icon,
    showConfirmButton,
    allowOutsideClick: false,
    didOpen: () => {
      if (showLoading) {
        Swal.showLoading();
      }
    }
  });
}
