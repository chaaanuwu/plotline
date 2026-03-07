import { useEffect, useState } from "react";
import axios from "axios";
import bbBg from "../assets/bb-bg.jpg";

export default function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         const token = localStorage.getItem("token");
    //         console.log("Token in Profile.jsx:", token);

    //         if (!token) {
    //             setError("Token not found. Please log in.");
    //             setLoading(false);
    //             return;
    //         }

    //         try {
    //             const userRes = await axios.get(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/user/me`, {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             });
    //             setProfileData(userRes.data.user);

    //             try {
    //                 const followersRes = await axios.get(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/me/followers`, {
    //                     headers: { Authorization: `Bearer ${token}` },
    //                 });

    //                 setFollowers(followersRes.data)

    //             } catch (err) {
    //                 console.error("Error fetching followers:", err);
    //             }
    //         } catch (err) {
    //             if (err.response) {
    //                 // Server responded with a status code outside 2xx
    //                 console.error("Server error:", err.response.status, err.response.data);
    //             } else if (err.request) {
    //                 // Request was made but no response received
    //                 console.error("No response received:", err.request);
    //             } else {
    //                 // Something else happened setting up the request
    //                 console.error("Axios error:", err.message);
    //             }
    //             setError("Failed to load profile.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProfile();
    // }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await axios.get(`${import.meta.env.VITE_PLOTLINE_BASE_URL}/profile/me`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setProfileData(profileData.data);
            } catch (err) {
                if (err.response) {
                    // Server responded with a status code outside 2xx
                    console.error("Server error:", err.response.status, err.response.data);
                } else if (err.request) {
                    // Request was made but no response received
                    console.error("No response received:", err.request);
                } else {
                    // Something else happened setting up the request
                    console.error("Axios error:", err.message);
                }
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }

        };

        fetchProfile();
    }, []);



    if (loading) return <p>Loading profile...</p>;
    if (error) return <p>{error}</p>;

    return (
        <main>
            <section id="info" className="mt-8">
                <div>
                    <div className="cover w-full h-[350px] rounded-xl overflow-hidden relative">
                        <img
                            src={bbBg}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-semibold mt-4">{profileData.user.firstName} {profileData.user.lastName}</h1>
                    <div>
                        <p className="text-lg">{profileData.user.about}</p>
                        <div className="flex gap-4 mt-2">
                            <a href="/followers" className="text-lg">{profileData?.followersCount || 0} Followers</a>
                            <a href="/following" className="text-lg">{profileData?.followingCount || 0} Following</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}