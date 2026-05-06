const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
  cardId: { type: String, unique: true }, // ✅ ADD THIS
  receiverName: String,
  senderName: String,
  occasion: String,
  customOccasion: String,
  message: String,
  bouquet: [String],
  image: String,
  qrCode: String,
  link: String,
  likes: { type: Number, default: 0 },
  scheduledDate: Date,
  theme: String
}, { timestamps: true });

module.exports = mongoose.model("Card", cardSchema);