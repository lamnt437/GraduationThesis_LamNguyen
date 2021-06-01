import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
const Toast = ({ type, content }) => {
  toast.error(content, {
    autoClose: 3000,
  });

  return null;
};

export default Toast;
