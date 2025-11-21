const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Label = require("../models/Label");
const auth = require("../middleware/auth");

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// POST /api/label  (Protected)
router.post("/", auth, upload.single("labelImage"), async (req, res) => {
    try {
        const { labelText, capColor } = req.body;

        // req.user მოდის JWT-დან
        const newLabel = new Label({
            userId: req.user.id,
            name: req.user.name,
            email: req.user.email,
            labelText,
            capColor,
            image: req.file ? req.file.filename : null
        });

        await newLabel.save();

        res.json({
            success: true,
            message: "Label saved",
            data: newLabel
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
});

module.exports = router;
