import { Link } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../store/userStore";
import Modal from "./ui/Modal";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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

          <button onClick={() => setOpen(true)}>
            Logout
          </button>

          <Modal
            open={open}
            setOpen={setOpen}
            title={"Logout"}
            icon={<ArrowRightStartOnRectangleIcon aria-hidden="true" className="size-6 text-red-600" />}
            description={"Are you sure you want to logout?"}
            confirmText={"Logout"}
            cancelText={"Cancel"}
            confirmClassName={"bg-red-600"}
            onConfirm={logout}
          />


        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}

    </nav>
  );
}