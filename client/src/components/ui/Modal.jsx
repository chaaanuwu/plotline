import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, setOpen, children }) {
  return (
    <AnimatePresence>
      {open && (
        /* Added [ ] around 200 and pointer-events-none */
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 pointer-events-none">
          
          {/* BACKDROP - Added pointer-events-auto so you can click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm pointer-events-auto"
          />

          {/* MODAL CONTENT - Added pointer-events-auto so you can click buttons */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 pointer-events-auto"
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-8 right-8 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
            >
              ✕
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}