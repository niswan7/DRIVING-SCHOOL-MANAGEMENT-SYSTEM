import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content-student ${size}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-student">
          <h2>{title}</h2>
          <button className="modal-close-student" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>
        <div className="modal-body-student">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
