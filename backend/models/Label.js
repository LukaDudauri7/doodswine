const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true },
    email: { type: String, required: true },

    labelText: { type: String, required: true },
    capColor: { type: String, required: true },
    image: { type: String },

    phone: { type: String, required: true },

    status: {
      type: String,
      default: "pending_contact"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

LabelSchema.virtual("createdAtFormatted").get(function () {
  return this.createdAt
    ? this.createdAt.toLocaleString("ka-GE", {
        timeZone: "Asia/Tbilisi",
        dateStyle: "medium",
        timeStyle: "short"
      })
    : null;
});

LabelSchema.virtual("updatedAtFormatted").get(function () {
  return this.updatedAt
    ? this.updatedAt.toLocaleString("ka-GE", {
        timeZone: "Asia/Tbilisi",
        dateStyle: "medium",
        timeStyle: "short"
      })
    : null;
});

module.exports = mongoose.model("Label", LabelSchema);
