import '../global.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <title>SGE - Sistema de Gerenciamento Empresarial</title>
      <link rel="icon" href="https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Business_case-256.png" />
    </Head>
    <Component {...pageProps} /><ToastContainer /></>
}
