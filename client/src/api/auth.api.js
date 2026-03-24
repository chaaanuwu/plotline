import axiosInstance from "./axiosInstance";

export const signIn = async (email, password) => {
    const res = await axiosInstance.post("/auth/sign-in", {
        email,
        password
    });

    return res.data;
}