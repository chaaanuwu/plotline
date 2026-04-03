import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 w-full bg-stone-50/50">
      <div className="relative flex items-center justify-center">
        
        {/* OUTER REEL PIECES */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20 border-4 border-stone-200 rounded-full flex items-center justify-center"
        >
          {/* Reel Holes */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-stone-50 border-2 border-stone-200 rounded-full"
              style={{
                transform: `rotate(${i * 90}deg) translateY(-28px)`,
              }}
            />
          ))}
        </motion.div>

        {/* CENTER ICON */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute text-amber-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 8.703a4.126 4.126 0 017.746 0 .75.75 0 01-.351.92 7.47 7.47 0 01-3.522.877 7.47 7.47 0 01-3.522-.877.75.75 0 01-.351-.92zM15 8.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15zM14.25 12a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H15a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3.75a.75.75 0 000-1.5H15z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </div>

      {/* LOADING TEXT */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 pl-[0.4em]"
      >
        {text}
      </motion.p>
      
      {/* SCANLINE EFFECT (Subtle detail) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%]" />
    </div>
  );
}