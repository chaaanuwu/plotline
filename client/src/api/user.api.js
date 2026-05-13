import axiosInstance from "./axiosInstance";

export const getProfile = async (userId) => {
    const url = userId ? `/user/${userId}` : `/profile/me`;
    const res = await axiosInstance.get(url);
    return res.data;
};

export const setProfileCover = async (backdrop) => {
    const res = await axiosInstance.put('/user/me/edit', {
        cover: backdrop
    });

    return res.data;
}

export const editProfileData = async (pfp, about) => {
    const res = await axiosInstance.put('/user/me/edit', {
        pfp,
        about
    });

    return res.data;
}

export const updateAccountSettings = async (firstName, lastName, email, password) => {
    const res = await axiosInstance.put('/user/me/update-account', {
        firstName,
        lastName,
        email,
        password
    });

    return res;
}

export const verifyCurrentPassword = async (password) => {
    const res = await axiosInstance.post('/user/me/verify-password', { password });
    return res.data.isValid;
}

export const searchUsers = async (query) => {
    const res = await axiosInstance.get(`/user/search?q=${query}`);
    return res.data;
}