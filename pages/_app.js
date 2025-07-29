import '../global.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }) {
  return <><Component {...pageProps} /><ToastContainer /></>
}
