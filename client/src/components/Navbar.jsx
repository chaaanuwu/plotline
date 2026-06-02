import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useUserStore from "../store/userStore";
import Modal from "./ui/Modal";
import {
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  TicketIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import SearchBar from "./ui/SearchBar";
import Dropdown from "./ui/Dropdown";
import { ClockIcon } from "lucide-react";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const searchWrapperRef = useRef(null);

  // Auto-close mobile menu on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user?.firstName) return "U";
    return (user.firstName[0] + (user.lastName?.[0] || "")).toUpperCase();
  };

  const saveSearchQuery = (query) => {
    if (!query.trim()) return;
    const key = "searchHistory";
    let history = JSON.parse(localStorage.getItem(key)) || [];

    history = history.filter(item => item.query !== query);
    history.unshift({ query, timeStamp: Date.now() });

    if (history.length > 5) history.pop();
    localStorage.setItem(key, JSON.stringify(history));
  };

  const handleSearch = (query) => {
    if (!query.trim()) return;
    saveSearchQuery(query);
    navigate(`/search?q=${query}`);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsModalOpen(false); // Close modal cleanly
    setIsMobileMenuOpen(false);
    navigate("/login"); // Push cleanly to login landing
  };

  const isActive = (path) => location.pathname === path;
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
        <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-3xl px-4 md:px-6 py-2 flex justify-between items-center pointer-events-auto transition-all duration-500">

          {/* Logo Branding */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase cursor-pointer select-none">
              Plot<span className="text-amber-500 font-bold">Line</span>
            </div>
          </Link>

          {/* Center Search & Standard Desktop Links */}
          <div className="flex items-center flex-1 max-w-2xl px-2 sm:px-6 gap-2">
            <div className="hidden md:flex items-center gap-1 bg-stone-100/50 p-1 rounded-2xl border border-stone-200/50">
              <NavLink to="/" active={isActive('/')} icon={<HomeIcon className="size-4" />} label="Home" />
              <NavLink to="/movies" active={isActive('/movies')} icon={<TicketIcon className="size-4" />} label="Movies" />
            </div>

            {/* Input Bar Section Container */}
            <div ref={searchWrapperRef} className="relative w-full max-w-md mx-auto">
              <SearchBar
                onSearch={handleSearch}
                onFocus={() => setIsDropdownOpen(true)}
              />

              <Dropdown open={isDropdownOpen}>
                <div className="w-full min-w-75 md:min-w-112.5 p-2 bg-white/90 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-stone-100 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                      Recent Searches
                    </span>
                  </div>

                  {searchHistory.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSearch(item.query)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 transition-all w-full text-left group"
                        >
                          <div className="p-2 rounded-lg bg-stone-50 group-hover:bg-white transition-colors">
                            <ClockIcon className="size-4 text-stone-400" />
                          </div>
                          <span className="font-medium text-stone-700">{item.query}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-sm text-stone-400 font-medium">No recent searches found</p>
                    </div>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>

          {/* Right Action Stack */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {user ? (
              <>
                <Link
                  to="/me"
                  className="flex items-center gap-2.5 p-1 pr-3 rounded-2xl hover:bg-stone-100/80 transition-all group"
                >
                  <div className="relative">
                    {user?.pfp ? (
                      <img
                        src={user.pfp}
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
                    {user?.firstName}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 hover:shadow-inner transition-all duration-300"
                >
                  <ArrowRightStartOnRectangleIcon className="size-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-stone-950 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 hover:shadow-lg hover:shadow-amber-600/20 transition-all duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Trigger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 text-stone-700 active:scale-95 transition-all"
            >
              {isMobileMenuOpen ? <XMarkIcon className="size-5" /> : <Bars3Icon className="size-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-stone-950/60 backdrop-blur-lg animate-fade-in flex flex-col justify-between p-6 pt-28">
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-500 px-4">Navigation</p>
            <MobileNavLink to="/" active={isActive('/')} icon={<HomeIcon className="size-5" />} label="Home Feed" />
            <MobileNavLink to="/movies" active={isActive('/movies')} icon={<TicketIcon className="size-5" />} label="Explore Movies" />
          </div>

          <div className="border-t border-stone-800/60 pt-6 space-y-4">
            {user ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-400 font-bold text-sm tracking-wide transition-all"
              >
                <ArrowRightStartOnRectangleIcon className="size-5" />
                Logout Account
              </button>
            ) : (
              <Link
                to="/login"
                className="w-full flex items-center justify-center p-4 rounded-2xl bg-amber-500 text-black font-bold text-sm tracking-wide shadow-lg"
              >
                Sign In To PlotLine
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog Modal */}
      <Modal open={isModalOpen} setOpen={setIsModalOpen}>
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center">
            <div className="size-16 mb-6 flex items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100">
              <ArrowRightStartOnRectangleIcon className="size-8" />
            </div>

            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">Confirm Logout</h3>
            <p className="mt-3 text-stone-500 max-w-sm leading-relaxed">
              Are you sure you want to logout? You'll need to sign back in to review movies.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex-1 px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all active:scale-95 shadow-lg shadow-red-600/20"
              >
                Logout Now
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold transition-all active:scale-95"
              >
                Stay Signed In
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function NavLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${active ? "bg-white text-amber-600 shadow-sm" : "text-stone-400 hover:text-stone-900"
        }`}
    >
      <div className="text-amber-600">{icon}</div>
      <span className="text-amber-600 hidden lg:inline">{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${active ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10" : "text-stone-400 hover:bg-white/5 hover:text-white"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}