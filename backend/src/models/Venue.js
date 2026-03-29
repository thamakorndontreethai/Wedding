const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    address: { type: String, required: true },
    province: { type: String, required: true, index: true },
    capacityBuffet: { type: Number, required: true },
    capacityChinese: { type: Number, required: true },
    pricePerSession: { type: Number, required: true },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Venue", venueSchema);