import { useEffect } from "react";
import axios from "axios";
import useUserStore from "../store/userStore";

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
                const res = await axios.get(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/profile/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // store only the user object data
                setUser(res.data);

            } catch (err) {
                console.error("Auth error:", err);

                localStorage.removeItem("token");
                setError("Authentication failed");
            }
        };

        loadUser();

    }, [setUser, setLoading, setError]);
}