import { Link } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../store/userStore";
import Modal from "./ui/Modal";
import { ArrowRightStartOnRectangleIcon, UserIcon, FilmIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserStore();

  const getUserInitials = () => {
    if (!user.user?.firstName) return "U";
    const first = user.user.firstName?.[0] || "";
    const last = user.user.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 flex justify-center p-4 pointer-events-none">
      {/* GLASS CONTAINER */}
      <div className="w-full max-w-5xl bg-white backdrop-blur-md border border-white/20 shadow-lg rounded-2xl px-6 py-3 flex justify-between items-center pointer-events-auto">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <FilmIcon className="size-5" />
          </div>
          <span className="text-xl font-black tracking-tighter text-stone-900">
            Plot<span className="text-amber-600">Line</span>
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              {/* PROFILE LINK */}
              <Link 
                to={'/me'} 
                className="flex items-center gap-3 group"
              >
                <span className="hidden sm:block text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors">
                  {user.firstName}
                </span>
                
                {/* AVATAR OR INITIALS */}
                <div className="relative">
                  {user.user.pfp ? (
                    <img 
                      src={user.user.pfp} 
                      className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-sm group-hover:border-amber-500 transition-colors" 
                      alt="Profile" 
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-stone-100 border-2 border-white shadow-sm flex items-center justify-center text-[11px] font-black text-stone-500 group-hover:bg-amber-50 group-hover:text-amber-700 transition-all">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
              </Link>

              {/* LOGOUT BUTTON */}
              <button 
                onClick={() => setOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all"
                title="Logout"
              >
                <ArrowRightStartOnRectangleIcon className="size-5" />
              </button>

              <Modal
                open={open}
                setOpen={setOpen}
                title={"Logout"}
                icon={<ArrowRightStartOnRectangleIcon aria-hidden="true" className="size-6 text-red-600" />}
                description={"Are you sure you want to logout? You'll need to sign back in to review movies."}
                confirmText={"Logout"}
                cancelText={"Cancel"}
                confirmClassName={"bg-red-600 hover:bg-red-700"}
                onConfirm={logout}
              />
            </>
          ) : (
            <Link 
              to="/login" 
              className="text-sm font-bold text-stone-900 hover:text-amber-600 transition-colors flex items-center gap-2"
            >
              Sign In <ArrowRightStartOnRectangleIcon className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}