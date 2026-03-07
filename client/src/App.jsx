import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";

export default function App() {

    // prevents the flickering of the login page on initial load when token is present in localStorage
    const [token, setToken] = useState(() => {
        return localStorage.getItem("token");
    });

    return (
        // <>
        //     {token ? (
        //         <Feed />
        //     ) : (
        //         <LoginPage setToken={setToken} />
        //     )}
        // </>

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
                    path = "/profile"
                    element = {
                        token
                        ? <Profile />
                        : <Navigate to = "/login" />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}