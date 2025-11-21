const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },

    labelText: { type: String, required: true },
    capColor: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Label", LabelSchema);
