import { TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import { useEffect, useState } from "react";
import { updateAccountSettings, verifyCurrentPassword } from "../api/user.api";
import { toast } from "sonner";

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);

    // FIXED: Access your flattened user store directly
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    useEffect(() => {
        // FIXED: Using flat object context variables directly
        if (user) {
            setFormData((prev) => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let passwordPayload = undefined;

            // If a user starts typing a password change request
            if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
                if (!formData.currentPassword) {
                    toast.error("Please provide your current password to authorize security changes.");
                    setLoading(false);
                    return;
                }

                // Call the verification endpoint
                const isCurrentPasswordValid = await verifyCurrentPassword(formData.currentPassword);

                if (!isCurrentPasswordValid) {
                    toast.error("The current password you entered is incorrect.");
                    setLoading(false);
                    return;
                }

                if (!formData.newPassword || formData.newPassword.length < 8) {
                    toast.error("New password must be at least 8 characters long.");
                    setLoading(false);
                    return;
                }

                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error("New password and confirmation fields do not match.");
                    setLoading(false);
                    return;
                }

                passwordPayload = formData.newPassword;
            }

            // Fire data transmission to update preferences
            const res = await updateAccountSettings(
                formData.firstName,
                formData.lastName,
                formData.email.toLowerCase(),
                passwordPayload // Only passes if a valid intentional modification happened
            );

            const isSuccess = res?.success || res?.data?.success;
            const updatedUser = res?.user || res?.data?.user;

            if (isSuccess && updatedUser) {
                // FIXED: Set flat clean data straight into store
                setUser(updatedUser);
                
                // Clear out security strings locally
                setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
                toast.success("Account settings updated successfully!");
            } else {
                throw new Error(res?.message || "Failed to update your account system preferences.");
            }
        } catch (error) {
            console.error("Error updating account settings: ", error);
            toast.error(error.response?.data?.message || error.message || "An error occurred updating settings.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-stone-50 py-12 px-6 pt-36 selection:bg-amber-500/30">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16 border-b border-stone-200 pb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-0.5 w-8 bg-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">System Preferences</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-stone-900 tracking-tighter">
                        Account <span className="text-stone-300 font-thin">Settings</span>
                    </h1>
                </header>

                <form onSubmit={handleSaveChanges} className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-x-12 gap-y-16" autoCorrect="off" spellCheck="false">
                    
                    {/* SECTION: PROFILE */}
                    <aside>
                        <h3 className="text-sm font-bold text-stone-900">Profile Details</h3>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">This information will be displayed on your public reviews.</p>
                    </aside>
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-stone-300"
                                    placeholder="e.g. Quentin"
                                    required
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-stone-300"
                                    placeholder="e.g. Tarantino"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
                                placeholder="director@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* SECTION: SECURITY */}
                    <aside>
                        <h3 className="text-sm font-bold text-stone-900">Security</h3>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">Ensure your account is using a long, random password to stay secure.</p>
                    </aside>
                    <div className="space-y-4 bg-stone-100/50 p-6 rounded-2xl border border-stone-200/60">
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 ml-1">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder="••••••••••••"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                            />
                        </div>
                        <div className="h-0.5 bg-stone-200/60 my-2" />
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 ml-1">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder="Enter New Password"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-stone-400 mb-1.5 ml-1">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                                placeholder="Confirm New Password"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* DANGER ZONE */}
                    <aside>
                        <h3 className="text-sm font-bold text-red-600">Danger Zone</h3>
                    </aside>
                    <div>
                        <button
                            type="button"
                            className="group flex items-center justify-between w-full p-4 rounded-xl border border-red-100 bg-red-50/30 hover:bg-red-50 transition-all"
                        >
                            <div className="text-left">
                                <span className="block text-xs font-bold text-red-600 uppercase tracking-widest">Delete Account</span>
                                <span className="text-[10px] text-red-400/90 block mt-0.5">Permanently remove all your movie history and reviews.</span>
                            </div>
                            <TrashIcon className="size-5 shrink-0 text-red-300 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>

                    {/* Form Controls Submit Button */}
                    <div className="md:col-start-2 pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`px-10 py-3 rounded-full font-bold text-sm text-white bg-stone-900 shadow-xl transition-all active:scale-[0.98]
                                ${loading ? 'opacity-60 cursor-not-allowed shadow-none' : 'hover:bg-black hover:scale-102 shadow-stone-200'}
                            `}
                        >
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}