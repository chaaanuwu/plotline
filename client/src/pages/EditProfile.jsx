import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for cancellation routing
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import defaultPfp from "../assets/default-pfp.jpg";
import { editProfileData } from "../api/user.api";
import axios from "axios";
import { toast } from "sonner";

export default function EditProfile() {
    const { user, setUser } = useUserStore();
    const [loading, setLoading] = useState(false);
    
    // FIXED: Pull directly from the root user object structure
    const [about, setAbout] = useState(user?.about || "");
    const [previewPfp, setPreviewPfp] = useState(user?.pfp || defaultPfp);
    const [selectedPfpFile, setSelectedPfpFile] = useState(null);

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // FIXED: Safely read existing profile photo directly from correct root path
            let imageUrl = user?.pfp || "";

            // Cloudinary Image Stream Processing Upload
            if (selectedPfpFile) {
                const formData = new FormData();
                formData.append("file", selectedPfpFile);
                formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
                formData.append("folder", import.meta.env.VITE_CLOUDINARY_ASSET_FOLDER);

                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD;

                const cloudinaryRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    formData
                );

                imageUrl = cloudinaryRes.data.secure_url;
            }

            const res = await editProfileData(imageUrl, about);

            // Dynamically check response format structure strings
            const isSuccess = res?.success || res?.data?.success;
            const updatedUser = res?.user || res?.data?.user;

            if (isSuccess && updatedUser) {
                // FIXED: Keep state fully flattened to preserve global reactivity across Navbar/Profile
                setUser(updatedUser);
                
                toast.success("Profile updated successfully!");
                
                // Route user smoothly back to their personal profile view
                navigate("/me");
            } else {
                throw new Error(res?.message || "Server denied updating profile modifications.");
            }
        } catch (err) {
            console.error("Profile payload sync error:", err);
            toast.error(err.response?.data?.message || err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-stone-50 py-12 px-6 pt-36">
            <div className="max-w-3xl mx-auto">

                <header className="mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 bg-amber-500 rounded-full" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-stone-400 uppercase">Public Persona</span>
                    </div>
                    <h1 className="text-4xl font-black text-stone-900 tracking-tighter">
                        Edit <span className="text-stone-400 font-light italic">Profile</span>
                    </h1>
                </header>

                <form onSubmit={handleSave} className="space-y-10">

                    {/* PFP Upload Section */}
                    <section className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-6">Profile Picture</h3>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-4xl overflow-hidden border-4 border-amber-50 shadow-xl">
                                    <img
                                        src={previewPfp}
                                        alt="Preview"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-amber-500 transition-colors shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setSelectedPfpFile(file);
                                            setPreviewPfp(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-stone-900 font-bold text-lg">Change Avatar</p>
                                <p className="text-stone-400 text-sm leading-relaxed">
                                    Upload a high-quality image. <br />
                                    Supports JPG, PNG or WebP.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Bio Section */}
                    <section className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-stone-500 mb-6">Director's Statement</h3>
                        <div className="relative">
                            <textarea
                                value={about}
                                onChange={(e) => setAbout(e.target.value.slice(0, 250))} // Enforce client boundary max ceiling length limit
                                rows="5"
                                placeholder="Write a short bio about your cinematic journey..."
                                className="w-full p-6 bg-stone-50 border-2 border-transparent focus:border-amber-400/20 focus:bg-white rounded-3xl outline-none transition-all duration-300 text-stone-800 font-serif italic text-lg leading-relaxed resize-none"
                            />
                            <div className="absolute right-4 bottom-4 text-[10px] font-black text-stone-300 uppercase tracking-widest">
                                {about.length} / 250
                            </div>
                        </div>
                    </section>

                    {/* Form Submission Actions Layout Footer Panel */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/me")} // FIXED: Navigate user safely out of editing layer on cancel click
                            className="px-8 py-4 text-stone-400 font-bold hover:text-stone-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-12 py-4 bg-stone-900 text-white rounded-2xl font-black transition-all shadow-xl active:scale-95 flex items-center gap-3
                                ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-500 hover:text-stone-900'}
                            `}
                        >
                            {loading ? 'Saving Changes...' : 'Update Profile'}
                            {!loading && <span className="material-symbols-outlined text-sm">check_circle</span>}
                        </button>
                    </div>
                </form>

                {/* Settings Forwarding Block Link */}
                <div className="mt-12 pt-8 border-t border-stone-200 text-center">
                    <p className="text-stone-400 text-sm font-medium">
                        Looking to change your name or password?
                        <span 
                            onClick={() => navigate("/settings")} 
                            className="ml-2 text-amber-600 font-black uppercase tracking-widest text-[10px] hover:underline cursor-pointer"
                        >
                            Go to Account Settings
                        </span>
                    </p>
                </div>
            </div>
        </main>
    );
}