const express = require("express");
const router = express.Router();
const multer = require("multer");

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

router.post("/upload", upload.single("labelImage"), async (req, res) => {
    try {
        const { labelText, capColor } = req.body;

        return res.json({
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
