import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function Modal({ open, setOpen, children }) {

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        /* Backdrop */
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4pointer-events-auto"
          onClick={() => setOpen(false)}
        >
          {/* Content Container (Stop propagation so clicking inside doesn't close) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-7xl pointer-events-auto"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}