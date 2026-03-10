import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserStore from "./store/userStore";

import LoginPage from "./pages/LoginPage";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import useAuthLoader from "./hooks/useAuthLoader";

export default function App() {

    useAuthLoader();

    const isLoading = useUserStore((state) => state.isLoading);

    const [token, setToken] = useState(localStorage.getItem("token"));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>

                {/* Login Route */}
                <Route
                    path="/login"
                    element={
                        token
                            ? <Navigate to="/" />
                            : <LoginPage setToken={setToken} />
                    }
                />

                {/* Protected Routes */}

                {/* Feed Route */}
                <Route
                    path="/"
                    element={
                        token
                            ? <Feed />
                            : <Navigate to="/login" />
                    }
                />

                {/* Profile Route */}
                <Route
                    path="/me"
                    element={
                        token
                            ? <Profile />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/user/:userId"
                    element={
                        token
                            ? <Profile />
                            : <Navigate to="/login" />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}