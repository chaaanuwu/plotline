import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from './../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';

export const signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            dob,
            gender,
            about,
            pfp,
            cover
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "User already exists" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dob,
            gender,
            about,
            pfp,
            cover
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Server error:"
        });
    }
}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if(!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 401;
            throw error;
        }

        const token = jwt.sign({ userId: user._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                token,
                user
            }
        });

    } catch (error) {
        next(error);
    }
}