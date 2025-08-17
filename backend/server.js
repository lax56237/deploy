import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "./models/User.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    origin:"https://deploy-1-kyps.onrender.com",
     credentials: true, 
}));

console.log("Loaded MONGO_URL:", process.env.MONGO_URL);
console.log("Loaded JWT_TOKEN:", process.env.JWT_TOKEN);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ Mongo Error:", err));

app.post("/register", async (req, res) => {
    try {
        const { name, userId } = req.body;

        const token = jwt.sign(
            { userId, name, createdAt: Date.now() },
            process.env.JWT_TOKEN,
            { expiresIn: "1h" }
        );

        const newUser = new User({ name, userId });
        await newUser.save();

        res.json({ message: "User registered", token });
    } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

app.get("/auth", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        res.json({ valid: true, userId: decoded.userId, name: decoded.name });
    } catch (err) {
        res.status(403).json({ valid: false, error: "Invalid or expired token" });
    }
});

app.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (user) return res.json({ name: user.name });
        res.json({ message: "No user found" });
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
