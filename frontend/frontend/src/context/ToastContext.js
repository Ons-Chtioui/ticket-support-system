import React, { createContext, useState, useContext } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Fonction pour afficher un toast
  const showToast = (msg, type = 'success') => {
    const id = Date.now(); // identifiant unique
    setToasts(prev => [...prev, { id, msg, type }]);
  };

  // Fonction pour fermer un toast
  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => hideToast(toast.id)}
            show={true}
            delay={3000}
            autohide
            bg={toast.type} // 'success', 'danger', 'info', etc.
          >
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body className={toast.type === 'light' ? '' : 'text-white'}>
              {toast.msg}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Hook pour utiliser le toast facilement
export const useToast = () => useContext(ToastContext);
