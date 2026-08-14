import { createContext, useContext, useState, useCallback } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg) => addToast(msg, "success"), [addToast]);
  const showError = useCallback((msg) => addToast(msg, "error"), [addToast]);
  const showInfo = useCallback((msg) => addToast(msg, "info"), [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      {/* Floating Toast Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md text-sm font-semibold transition-all duration-300 animate-bounce ${
              toast.type === "error"
                ? "bg-slate-900/95 text-red-300 border-red-800"
                : toast.type === "info"
                ? "bg-slate-900/95 text-blue-300 border-blue-800"
                : "bg-slate-900/95 text-emerald-300 border-emerald-800"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === "error" ? (
                <FaExclamationCircle className="text-red-400 text-base shrink-0" />
              ) : toast.type === "info" ? (
                <FaInfoCircle className="text-blue-400 text-base shrink-0" />
              ) : (
                <FaCheckCircle className="text-emerald-400 text-base shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition p-1"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showSuccess: (msg) => console.log("[Success Toast]", msg),
      showError: (msg) => console.error("[Error Toast]", msg),
      showInfo: (msg) => console.log("[Info Toast]", msg),
    };
  }
  return context;
};
