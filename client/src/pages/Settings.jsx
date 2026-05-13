import { TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import useUserStore from "../store/userStore";
import { useEffect, useState } from "react";
import {  updateAccountSettings, verifyCurrentPassword } from "../api/user.api";

export default function SettingsPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const user = useUserStore((state) => state.user);
    const userData = user?.user;

    useEffect(() => {
        if (userData) {
            setFormData((prev) => ({
                ...prev,
                firstName: userData.firstName || "",
                lastName: userData.lastName || "",
                email: userData.email || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            }));
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            if (formData.currentPassword) {
                const isCurrectPasswordValid = await verifyCurrentPassword(formData.currentPassword);

                if (!isCurrectPasswordValid) {
                    alert("Current password is incorrect.");
                    return;
                }

                if (formData.newPassword !== formData.confirmPassword) {
                    alert("New password and confirm password do not match.");
                    return;
                }
            }

            const res = await updateAccountSettings(formData.firstName, formData.lastName, formData.email, formData.newPassword);

            if (res.success) {
                user.setUser({ ...user, user: res.user });
                setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
                alert("Settings updated successfully!");
            }
        } catch (error) {
            console.error("Error updating account settings: ", error);
        }
    }

    return (
        <main className="min-h-screen bg-stone-50 py-12 px-6 pt-36 selection:bg-amber-200">
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
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 ml-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-stone-300"
                                    placeholder="e.g. Quentin"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 ml-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-stone-300"
                                    placeholder="e.g. Tarantino"
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
                                autoComplete="none"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all"
                                placeholder="director@example.com"
                            />
                        </div>
                    </div>

                    {/* SECTION: SECURITY */}
                    <aside>
                        <h3 className="text-sm font-bold text-stone-900">Security</h3>
                        <p className="text-xs text-stone-500 mt-1 leading-relaxed">Ensure your account is using a long, random password to stay secure.</p>
                    </aside>
                    <div className="space-y-4 bg-stone-100/50 p-6 rounded-2xl border border-stone-200/60">
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            autoComplete="new-password"
                            placeholder="Current Password"
                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                        />
                        <div className="h-0.5 bg-stone-200 my-2" />
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            autoComplete="new-password"
                            placeholder="New Password"
                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            readOnly
                            onFocus={(e) => e.target.removeAttribute('readonly')}
                            autoComplete="new-password"
                            placeholder="Confirm New Password"
                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-stone-400 transition-all"
                        />
                    </div>

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
                                <span className="text-[10px] text-red-400">Permanently remove all your movie history and reviews.</span>
                            </div>
                            <TrashIcon className="size-5 text-red-300 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>

                    <div className="md:col-start-2 pt-8 flex justify-end">
                        <button type="submit" className="bg-stone-900 text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-black hover:scale-105 transition-all shadow-xl shadow-stone-200">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}