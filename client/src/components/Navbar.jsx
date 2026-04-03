import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../store/userStore";
import Modal from "./ui/Modal";
import { 
  ArrowRightStartOnRectangleIcon, 
  FilmIcon, 
  HomeIcon, 
  TicketIcon 
} from "@heroicons/react/24/outline";
import SearchBar from "./ui/SearchBar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUserStore();
  const location = useLocation();

  const getUserInitials = () => {
    const userData = user?.user || user;
    if (!userData?.firstName) return "U";
    return (userData.firstName[0] + (userData.lastName?.[0] || "")).toUpperCase();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center p-4 pointer-events-none">
      {/* GLASS CONTAINER */}
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-3xl px-4 md:px-8 py-2 flex justify-between items-center pointer-events-auto transition-all duration-500">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 bg-stone-950 rounded-xl flex items-center justify-center text-amber-500 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-amber-900/20">
            <FilmIcon className="size-5" />
          </div>
          <span className="hidden lg:block text-xl font-black tracking-tighter text-stone-950">
            Plot<span className="text-amber-600">Line</span>
          </span>
        </Link>

        {/* CENTER NAVIGATION & SEARCH */}
        <div className="flex items-center flex-1 max-w-2xl px-6 gap-2">
            <div className="hidden md:flex items-center gap-1 bg-stone-100/50 p-1 rounded-2xl border border-stone-200/50">
                <NavLink to="/" active={isActive('/')} icon={<HomeIcon className="size-4" />} label="Home" />
                <NavLink to="/movies" active={isActive('/movies')} icon={<TicketIcon className="size-4" />} label="Movies" />
            </div>
            
            <div className="flex-1">
                <SearchBar />
            </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          {user ? (
            <>
              <Link
                to={'/me'}
                className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-stone-100 transition-all group"
              >
                <div className="relative">
                  {user?.user?.pfp ? (
                    <img
                      src={user.user.pfp}
                      className="w-9 h-9 rounded-xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-[11px] font-black text-white group-hover:scale-105 transition-transform">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <span className="hidden xl:block text-xs font-black uppercase tracking-widest text-stone-600">
                  {user?.user?.firstName || user?.firstName}
                </span>
              </Link>

              <button
                onClick={() => setOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 hover:shadow-inner transition-all duration-300"
              >
                <ArrowRightStartOnRectangleIcon className="size-5" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-stone-950 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <Modal
        open={open}
        setOpen={setOpen}
        title={"Logout"}
        icon={<ArrowRightStartOnRectangleIcon className="size-6 text-red-600" />}
        description={"Are you sure you want to logout? You'll need to sign back in to review movies."}
        confirmText={"Logout"}
        cancelText={"Cancel"}
        confirmClassName={"bg-red-600 hover:bg-red-700"}
        onConfirm={logout}
      />
    </nav>
  );
}

// Sub-component for cleaner nav links
function NavLink({ to, active, icon, label }) {
    return (
        <Link 
            to={to} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                active 
                ? "bg-white text-amber-600 shadow-sm" 
                : "text-stone-400 hover:text-stone-900"
            }`}
        >
            {icon}
            <span className="hidden lg:inline">{label}</span>
        </Link>
    );
}