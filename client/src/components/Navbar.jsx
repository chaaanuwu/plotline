import { Link, useLocation, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  const handleSearch = (query) => {
    navigate(`/search?q=${query}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      {/* GLASS CONTAINER */}
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-3xl px-4 md:px-8 py-2 flex justify-between items-center pointer-events-auto transition-all duration-500">

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
          <div className="hidden md:flex items-center gap-1 bg-stone-100/50 p-1 rounded-2xl border border-stone-200/50 ">
            <NavLink to="/" active={isActive('/')} icon={<HomeIcon className="size-4 text-amber-600" />} label="Home" />
            <NavLink to="/movies" active={isActive('/movies')} icon={<TicketIcon className="size-4 text-amber-600" />} label="Movies" />
          </div>

          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
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
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 border-2 border-white shadow-md flex items-center justify-center text-[11px] font-black text-white group-hover:scale-105 transition-transform">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <span className="hidden xl:block text-xs font-black uppercase tracking-widest text-stone-800">
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

      <Modal open={open} setOpen={setOpen}>
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            {/* Icon Container */}
            <div className="size-16 mb-6 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
              <ArrowRightStartOnRectangleIcon className="size-8" />
            </div>

            {/* Text Content */}
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
              Confirm Logout
            </h3>
            <p className="mt-3 text-stone-500 max-w-sm leading-relaxed">
              Are you sure you want to logout? You'll need to sign back in to review movies.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-md z-200">
              <button
                onClick={logout}
                className="flex-1 px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all active:scale-95 shadow-lg shadow-red-600/20"
              >
                Logout Now
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-all active:scale-95"
              >
                Stay Signed In
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </nav>
  );
}

// Sub-component for cleaner nav links
function NavLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active
        ? "bg-white text-amber-600 shadow-sm"
        : "text-stone-400 hover:text-stone-900"
        }`}
    >
      {icon}
      <span className="hidden lg:inline text-amber-600">{label}</span>
    </Link>
  );
}