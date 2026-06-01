import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "./store/userStore";

import LoginPage from "./pages/LoginPage";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import useAuthLoader from "./hooks/useAuthLoader";
import MoviePage from "./pages/MoviePage";
import Navbar from "./components/Navbar";
import TmdbMovie from "./pages/MoviesPage";
import SearchResultPage from "./pages/SearchResultPage";
import EditProfile from "./pages/EditProfile";
import SettingsPage from "./pages/Settings";
import Landing from "./pages/Landing";
import Loader from "./components/ui/Loader";

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
        return <Loader />;
    }

    return (
        <BrowserRouter>
            {token && !isExpired && <Navbar />}

            <Routes>
                <Route
                    path="/"
                    element={
                        token && !isExpired
                            ? <Feed />
                            : <Landing />
                    }
                />

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
                            : <Landing />
                    }
                />

                {/* Profile */}
                <Route
                    path="/me"
                    element={
                        token && !isExpired
                            ? <Profile />
                            : <Landing />
                    }
                />

                <Route
                    path="/user/:userId"
                    element={
                        token && !isExpired
                            ? <Profile />
                            : <Landing />
                    }
                />

                <Route
                    path="/movies"
                    element={
                        token && !isExpired
                            ? <TmdbMovie />
                            : <Landing />
                    }
                />

                <Route
                    path="/movies/:movieId"
                    element={
                        token && !isExpired
                            ? <MoviePage />
                            : <Landing />
                    }
                />

                <Route
                    path="/search"
                    element={
                        token && !isExpired
                            ? <SearchResultPage />
                            : <Landing />
                    }
                />

                <Route
                    path="/edit-profile"
                    element={
                        token && !isExpired
                            ? <EditProfile />
                            : <Landing />
                    }
                />

                <Route
                    path="/settings"
                    element={
                        token && !isExpired
                            ? <SettingsPage />
                            : <Landing />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}