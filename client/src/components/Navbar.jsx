import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUserInitials = () => {
    if (!user?.firstName) return "U";
    return (
      user.firstName[0] + (user.lastName?.[0] || "")
    ).toUpperCase();
  };

  const saveSearchQuery = (query) => {
    if (!query.trim()) return;
    const key = "searchHistory";
    let history = JSON.parse(localStorage.getItem(key)) || [];

    history = history.filter((item) => item.query !== query);
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
    setIsModalOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const searchHistory =
    JSON.parse(localStorage.getItem("searchHistory")) || [];

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
        <div className="w-full max-w-6xl bg-white md:bg-white/40 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] rounded-3xl px-4 md:px-6 py-2 flex justify-between items-center pointer-events-auto transition-all duration-500">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">
              <span className="text-black">Plot</span>
              <span className="text-amber-500">Line</span>
            </div>
          </Link>

          {/* SEARCH + LINKS */}
          <div className="flex items-center flex-1 max-w-2xl px-2 sm:px-6 gap-2">
            <div className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200/50">
              <NavLink to="/" active={isActive("/")} icon={<HomeIcon className="size-4" />} label="Home" />
              <NavLink to="/movies" active={isActive("/movies")} icon={<TicketIcon className="size-4" />} label="Movies" />
            </div>

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
                          onClick={() => handleSearch(item.query)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 w-full text-left"
                        >
                          <ClockIcon className="size-4 text-stone-400" />
                          <span className="font-medium text-stone-700">
                            {item.query}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-stone-400">
                      No recent searches found
                    </div>
                  )}
                </div>
              </Dropdown>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {user ? (
              <>
                <Link
                  to="/me"
                  className="hidden md:flex items-center gap-2.5 p-1 pr-3 rounded-2xl bg-stone-100 hover:bg-white transition-all"
                >
                  {user?.pfp ? (
                    <img src={user.pfp} className="w-9 h-9 rounded-xl object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black">
                      {getUserInitials()}
                    </div>
                  )}
                  <span className="hidden xl:block text-xs font-black uppercase tracking-widest text-stone-700">
                    {user?.firstName}
                  </span>
                </Link>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl text-stone-400 bg-stone-100 hover:text-red-600 hover:bg-red-50"
                >
                  <ArrowRightStartOnRectangleIcon className="size-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:block bg-stone-950 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="size-5" />
              ) : (
                <Bars3Icon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>

        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-lg" />

        <div className="relative h-full flex flex-col justify-between p-6 pt-28 bg-white">

          {/* TOP */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-500 px-4">
              Navigation
            </p>

            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <MobileNavLink
                    to="/"
                    active={isActive("/")}
                    icon={<HomeIcon className="size-5" />}
                    label="Home Feed"
                  />
                  <MobileNavLink
                    to="/movies"
                    active={isActive("/movies")}
                    icon={<TicketIcon className="size-5" />}
                    label="Explore Movies"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BOTTOM SECTION */}
          <div className="space-y-4 pt-6">

            {/* PROFILE */}
            {user && (
              <Link
                to="/me"
                className="flex items-center gap-4 p-4 rounded-2xl bg-stone-100 text-stone-900 font-bold text-sm"
              >
                {user?.pfp ? (
                  <img src={user.pfp} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black">
                    {getUserInitials()}
                  </div>
                )}

                <span className="font-semibold">
                  {user?.firstName} {user?.lastName || ""}
                </span>
              </Link>
            )}

            <div className="border-t border-stone-200 pt-6 space-y-4">
              {user ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-500/10 text-red-500 font-bold text-sm"
                >
                  <ArrowRightStartOnRectangleIcon className="size-5" />
                  Logout Account
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center p-4 rounded-2xl bg-amber-500 text-black font-bold text-sm"
                >
                  Sign In To PlotLine
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal
        open={isModalOpen}
        setOpen={setIsModalOpen}
        className="max-w-sm flex justify-center items-center"
      >
        <div className="w-full max-w-sm bg-white text-stone-900 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold text-center">
            Confirm Logout
          </h3>

          <p className="mt-2 text-sm text-stone-500 text-center leading-relaxed">
            You will be signed out of your account and need to log in again to continue.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleLogoutClick}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
            >
              Yes, Logout
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 bg-stone-100 text-stone-800 rounded-xl font-semibold hover:bg-stone-200 transition"
            >
              Cancel
            </button>
          </div>

          <p className="mt-4 text-[11px] text-stone-400 text-center">
            Tip: You can always log back in anytime.
          </p>
        </div>
      </Modal>
    </>
  );
}

/* NAV LINK */
function NavLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${active ? "bg-white shadow-sm" : ""
        } `}
    >
      <span className="text-amber-500 hidden lg:inline">{icon}</span>
      <span className="text-amber-500 hidden lg:inline">{label}</span>
    </Link>
  );
}

/* MOBILE NAV */
function MobileNavLink({ to, active, icon, label }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all shadow-sm border border-stone-100 mt-4 ${active ? "bg-white" : ""
        }`}
    >
      <span className="text-amber-500">{icon}</span>
      <span className="text-amber-500">{label}</span>
    </Link>
  );
}