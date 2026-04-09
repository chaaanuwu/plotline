import { motion, AnimatePresence } from "framer-motion";

export default function Dropdown({ open, children }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-full right-0 mt-2 bg-white shadow-md rounded-xl p-1 z-50 border-2 border-stone-100"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}