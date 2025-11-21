const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// POST /api/label
router.post("/", upload.single("labelImage"), async (req, res) => {
    try {
        const { labelText, capColor } = req.body;

        res.json({
            success: true,
            message: "Label saved",
            data: {
                labelText,
                capColor,
                image: req.file ? req.file.filename : null
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Upload failed" });
    }
});

module.exports = router;
