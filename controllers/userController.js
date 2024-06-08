import express from "express";
import asyncHandler from "express-async-handler";
import User from "../model/user.js";
import { generateToken } from "../middleware/auth.js";

export const userRegister = async (req, res) => {
    try {
        const data = req.body;

        // Check if there is already an same user
        const userExisted = await User.findOne({ email: data.email });
        if (userExisted) {
            return res.status(400).json({ error: "user already exists" });
        }

        const newData = new User(data);

        const response = await newData.save();

        const payload = {
            id: response.id,
        };

        const token = generateToken(payload);
        res.status(201).json({ response, token });
    } catch (error) {
        res.status(400).json({ message: "required Field is Invalid", error: error.message });
    }
};

export const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body
        console.log(req.body)

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const userData = await User.findOne({ email: email });

        if (!userData || !(await userData.comparePassword(password)))
            return res.status(401).json({ error: "Invalid email or password" })

        const payload = {
            id: userData.id,
        }

        const token = generateToken(payload)

        res.status(200).json({ user: userData, token });
    } catch (error) {
        res.status(500).json({ message: 'Error adding data', error: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {

        const userData = req.user
        const userId = userData.id;
        const user = await User.findById(userId)

        res.status(200).json({ user })

    } catch (error) {
        console.log("err", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const userProfilePhoto = asyncHandler(async (req, res) => {
    try {
        const profilePath = req.file;
        console.log("file:", req.file);
        const baseUrl = req.protocol + "://" + req.get("host");
        const imageUrl = `${baseUrl}/public/uploads/${req.file.path}`;
        const userId = req?.body?.user_id;
        const userData = await User.findByIdAndUpdate(userId, { profile_photo: imageUrl }, { new: true });
        if (!userData)
            return res.status(404).json({ message: "User Id not found" });

        res.status(200).json({ user: userData });
    } catch (error) {
        console.log("error", error);
    }
});
