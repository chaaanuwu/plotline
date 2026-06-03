import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useUserStore from "./store/userStore";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
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

// Optional: Keep this here only if your Zustand store doesn't handle validation fallback natively
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
    // 1. Run your auth loader hook to hydrate store from localStorage on mount
    useAuthLoader();

    // 2. Extract global state properties reactively from Zustand
    const user = useUserStore((state) => state.user);
    const isLoading = useUserStore((state) => state.isLoading);

    // Fallback protection check against token expiration if user state is cached but invalid
    const token = localStorage.getItem("token");
    const isAuthenticated = user && token && !isTokenExpired(token);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <BrowserRouter>
            {/* Navbar shows dynamically when authenticated state updates */}
            {isAuthenticated && <Navbar />}

            <Routes>
                {/* Home / Feed Route */}
                <Route
                    path="/"
                    element={isAuthenticated ? <Feed /> : <Landing />}
                />

                {/* Login Route - Auto redirects to home if authenticated */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
                />

                {/* Signup Route - Auto redirects to home if authenticated */}
                <Route
                    path="/signup"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <SignUpPage />}
                />

                {/* Protected App Routes */}
                <Route
                    path="/me"
                    element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/user/:userId"
                    element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/movies"
                    element={isAuthenticated ? <TmdbMovie /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/movies/:movieId"
                    element={isAuthenticated ? <MoviePage /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/search"
                    element={isAuthenticated ? <SearchResultPage /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/edit-profile"
                    element={isAuthenticated ? <EditProfile /> : <Navigate to="/login" replace />}
                />

                <Route
                    path="/settings"
                    element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />}
                />

                {/* Catch-all Wildcard Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}