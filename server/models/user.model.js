import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
        minLength: [2, "First Name must be at least 2 characters long"],
        maxLength: [20, "First Name must be at most 20 characters long"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
        minLength: [2, "Last Name must be at least 2 characters long"],
        maxLength: [20, "Last Name must be at most 20 characters long"]
    },
    email: {
        type: String,
        required: [true, " Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [8, "Password must be at least 8 characters long"]
    },
    dob: {
        type: Date,
        required: [true, "Date of Birth is required"],
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        trim: true,
        enum: ['Male', 'Female', 'Other']
    },
    about: {
        type: String,
        trim: true,
    },
    pfp: {
        type: String,
        trim: true,
        default: null
    },
    cover: {
        type: String,
        trim: true,
        default: null
    }
}, {timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;