import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "./store/userStore";

import LoginPage from "./pages/LoginPage";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import useAuthLoader from "./hooks/useAuthLoader";
import MoviePage from "./pages/MoviePage";
import Navbar from "./components/Navbar";

function isTokenExpired(token) {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() > payload.exp * 1000;
    } catch {
        return true;
    }
}

export default function App() {

    useAuthLoader();

    const isLoading = useUserStore((state) => state.isLoading);

    const [token, setToken] = useState(localStorage.getItem("token"));

    const isExpired = isTokenExpired(token);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
                  <Navbar />

            <Routes>

                {/* Login Route */}
                <Route
                    path="/login"
                    element={
                        token && !isExpired
                            ? <Navigate to="/" />
                            : <LoginPage setToken={setToken} />
                    }
                />

                {/* Feed */}
                <Route
                    path="/"
                    element={
                        token && !isExpired
                            ? <Feed />
                            : <Navigate to="/login" />
                    }
                />

                {/* Profile */}
                <Route
                    path="/me"
                    element={
                        token && !isExpired
                            ? <Profile />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/user/:userId"
                    element={
                        token && !isExpired
                            ? <Profile />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/movies/:movieId"
                    element={
                        token && !isExpired
                            ? <MoviePage />
                            : <Navigate to="/login" />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}