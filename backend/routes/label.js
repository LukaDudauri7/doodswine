const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Label = require("../models/Label");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        // 👇 1️⃣ ნახე რეალურად რა მოდის
        console.log("REQ BODY:", req.body);
        console.log("REQ FILE:", req.file);

        const { labelText, capColor, phone } = req.body;

        // 👇 2️⃣ მკაცრი ვალიდაცია (ეს იყო მთავარი რაც გაკლდა)
        if (!labelText || !capColor || !phone) {
            return res.status(400).json({
                error: "Missing required fields",
                body: req.body
            });
        }

        const newLabel = new Label({
            userId: req.user.id,
            name: req.user.name,
            email: req.user.email,
            labelText,
            capColor,
            image: req.file ? req.file.path : null,
            phone
        });

        await newLabel.save();

        res.status(201).json({
            success: true,
            label: newLabel
        });

    } catch (err) {
        console.error("LABEL SAVE ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
});


router.get("/all", auth, async (req, res) => {
    try {
        const labels = await Label.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: labels.length,
            labels
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
});


module.exports = router;