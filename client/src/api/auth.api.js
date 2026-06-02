import axiosInstance from "./axiosInstance";

export const signIn = async (email, password) => {
    const res = await axiosInstance.post("/auth/sign-in", {
        email,
        password
    });

    return res.data;
}

export const signUp = async (firstName, lastName, email, password, dob, gender) => {
    const res = await axiosInstance.post("/auth/sign-up", {
        firstName,
        lastName,
        email,
        password,
        dob,
        gender
    });

    return res.data;
}