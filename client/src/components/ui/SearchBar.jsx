import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchBar({ placeholder = "Search..." }) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // "/" ignore if user is already typing somewhere
            if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
                e.preventDefault();
                inputRef.current?.focus();
            }

            if ((e.metaKey || e.ctrlKey) && e.key === "/") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto px-4">
            <div
                className={`relative flex items-center transition-all duration-300 rounded-2xl border ${isFocused
                    ? "border-amber-500/50 bg-white"
                    : "border-stone-200 bg-white/80 backdrop-blur-sm"
                    }`}
            >
                <div className="pl-5 text-stone-400">
                    <MagnifyingGlassIcon className={`size-5 transition-colors ${isFocused ? "text-amber-600" : ""}`} />
                </div>

                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-transparent border-none px-4 py-4 text-stone-800 placeholder-stone-400 focus:ring-0 text-sm md:text-base font-medium outline-none"
                />

                {/* Keyboard Hint (Desktop Only) */}
                <AnimatePresence>
                    {!isFocused && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hidden md:flex items-center gap-1 pr-5 pointer-events-none"
                        >
                            <kbd className="px-2 py-1 text-[10px] font-black bg-stone-100 text-stone-400 rounded-md border border-stone-200">
                                ⌘
                            </kbd>
                            <kbd className="px-2 py-1 text-[10px] font-black bg-stone-100 text-stone-400 rounded-md border border-stone-200">
                                /
                            </kbd>
                        </motion.div>
                    )}
                </AnimatePresence>

                {query && (
                    <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setQuery("")}
                        className="pr-4 text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                        Clear
                    </motion.button>
                )}
            </div>
        </div >
    );
}