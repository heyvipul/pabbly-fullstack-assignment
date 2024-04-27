const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const userDoc = await User.create({
            username,
            password: hashedPassword
        });
        res.status(201).json({ message: "User registered", user: userDoc });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ error: "Error in registration" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.findOne({ username });
        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
            const token = jwt.sign({ username: userDoc.username, id: userDoc._id }, process.env.JWT_SECRET);
            res.json({ token: token, user: userDoc, message: "Login successful" });
        } else {
            res.status(401).json({ error: "Incorrect password" });
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ error: "Error in login" });
    }
});

router.post("/logout", (req, res) => {
    //we just need to clear the token from localstorage 
    res.json({ message: "Logout successful" });
});

module.exports = router;
