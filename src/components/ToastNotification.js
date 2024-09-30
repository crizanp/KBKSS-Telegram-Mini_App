import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToast = (message, type = 'default') => {
  const commonOptions = {
    position: 'top-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      borderRadius: '10px',
    },
  };

  switch (type) {
    case 'success':
      toast.success(message, commonOptions);
      break;
    case 'error':
      toast.error(message, commonOptions);
      break;
    case 'warn':
      toast.warn(message, commonOptions);
      break;
    default:
      toast(message, commonOptions);
  }
};

const ToastNotification = () => {
  return <ToastContainer />;
};

export default ToastNotification;
