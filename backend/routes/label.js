const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Label = require("../models/Label");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/", auth, upload.single("image"), async (req, res) => {
    try {
        const newLabel = new Label({
            userId: req.user.id,
            name: req.user.name,
            email: req.user.email,
            labelText: req.body.labelText,
            capColor: req.body.capColor,
            image: req.file ? req.file.path : null   // ← Cloudinary URL
        });

        await newLabel.save();

        res.json({ success: true, label: newLabel });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/all", async (req, res) => {
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

// Multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + "-" + file.originalname;
//         cb(null, uniqueName);
//     }
// });

// const upload = multer({ storage });

// // POST /api/label  (Protected)
// router.post("/", auth, upload.single("labelImage"), async (req, res) => {
//     try {
//         const { labelText, capColor } = req.body;

//         // req.user მოდის JWT-დან
//         const newLabel = new Label({
//             userId: req.user.id,
//             name: req.user.name,
//             email: req.user.email,
//             labelText,
//             capColor,
//             image: req.file ? req.file.filename : null
//         });

//         await newLabel.save();

//         res.json({
//             success: true,
//             message: "Label saved",
//             data: newLabel
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Upload failed" });
//     }
// });

// module.exports = router;