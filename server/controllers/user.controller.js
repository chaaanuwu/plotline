import bcrypt from "bcryptjs";

import User from "../models/user.model.js";

export const getUserMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, password, gender, about, pfp, cover } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (gender) user.gender = gender;
    if (about) user.about = about;
    if (pfp) user.pfp = pfp;
    if (cover) user.cover = cover;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ success: true, user: userObj });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Server error" });
    }
} 