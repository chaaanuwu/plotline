import { useEffect } from "react";
import useUserStore from "../store/userStore";
import { getProfile } from "../api/user.api";

export default function useAuthLoader() {
    const { setUser, setLoading, setError } = useUserStore();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Fetch the current session user
                // Do not pass userId here; let the backend decrypt the JWT token securely
                const response = await getProfile();

                // Extract user object safely by checking standard data nesting structures
                const targetUser = response?.user || response?.data?.user || response;

                if (targetUser && (targetUser._id || targetUser.id)) {
                    setUser(targetUser);
                } else {
                    throw new Error("User structure is missing valid identity parameters.");
                }

            } catch (err) {
                console.error("Auth initialization session hydration failed:", err);

                // Clear out invalid token parameters to prevent continuous backend spamming
                localStorage.removeItem("token");
                setError(err.response?.data?.message || "Authentication failed");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [setUser, setLoading, setError]);
}