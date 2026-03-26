import { useEffect } from "react";
import useUserStore from "../store/userStore";
import { getProfile } from "../api/user.api";
import { useParams } from "react-router-dom";

export default function useAuthLoader() {
    const { setUser, setLoading, setError } = useUserStore();
    const { userId } = useParams();

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // fetch current user using token automatically attached by axiosInstance
                const user = await getProfile(userId);
                setUser(user);

            } catch (err) {
                console.error("Auth error:", err);

                // remove invalid token
                localStorage.removeItem("token");
                setError("Authentication failed");
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [setUser, setLoading, setError]);
}