import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalState } from "../types";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ModalProps {
  modalState: ModalState;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ modalState, onClose }) => {
  useEffect(() => {
    if (modalState.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalState.isOpen]);

  useEffect(() => {
    if (modalState.isOpen && modalState.type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [modalState.isOpen, modalState.type, onClose]);

  if (!modalState.isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {modalState.type === "success" ? (
                  <CheckCircle className="w-8 h-8 text-success-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-error-500" />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {modalState.type === "success" ? "Success!" : "Error"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Message */}
            <div className="mb-6">
              <div className="text-gray-700 whitespace-pre-line">
                {modalState.message}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              {modalState.type === "error" && (
                <button
                  onClick={onClose}
                  className="btn btn-secondary px-4 py-2"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
