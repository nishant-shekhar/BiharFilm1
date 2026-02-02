import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const AlertBox = ({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  autoClose = false,
  duration = 5000
}) => {

  React.useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, duration, onClose]);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle className="w-6 h-6" strokeWidth={2} />,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-100"
        };
      case "error":
        return {
          icon: <AlertCircle className="w-6 h-6" strokeWidth={2} />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-100"
        };
      case "warning":
        return {
          icon: <AlertTriangle className="w-6 h-6" strokeWidth={2} />,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100"
        };
      default:
        return {
          icon: <Info className="w-6 h-6" strokeWidth={2} />,
          color: "text-[#891737]",
          bgColor: "bg-[#891737]/5",
          borderColor: "border-[#891737]/10"
        };
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const iconConfig = getIconConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Alert Dialog */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-gray-100 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-1">
                    <img
                      src="/Logo1.png"
                      alt="BSFDFC"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">BSFDFC</h4>
                    <p className="text-xs text-gray-500">Bihar State Film Development Corporation</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-gray-500" strokeWidth={2} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-5">
                {/* Icon Section */}
                <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${iconConfig.bgColor} ${iconConfig.color} mx-auto mb-3`}>
                  {iconConfig.icon}
                </div>

                {/* Title */}
                {title && (
                  <h3 className="text-sm font-semibold text-gray-900 text-center mb-1.5">
                    {title}
                  </h3>
                )}

                {/* Message */}
                {message && (
                  <p className="text-xs text-gray-600 text-center leading-relaxed">
                    {message}
                  </p>
                )}
              </div>

              {/* Footer Actions */}
              <div className="px-4 py-3 border-t border-gray-100 flex gap-2 justify-end">
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-[#891737] hover:bg-[#891737]/90 rounded-lg transition-colors focus:outline-none"
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertBox;
