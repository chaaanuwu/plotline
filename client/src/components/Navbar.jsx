import { Link } from "react-router-dom";
import useUserStore from "../store/userStore";

export default function Navbar() {

  const { user, logout } = useUserStore();

  const getUserInitials = () => {
    if (!user?.firstName) return "U";

    return `${user.firstName} ${user.lastName}`
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="flex justify-between p-4 border-b">

      <Link to="/">PlotLine</Link>

      {user ? (
        <div className="flex items-center gap-3">

          <Link to={`/profile/${user._id}`}>
            {user.firstName}
          </Link>

          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {getUserInitials()}
          </div>

          <button onClick={logout}>
            Logout
          </button>

        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}

    </nav>
  );
}