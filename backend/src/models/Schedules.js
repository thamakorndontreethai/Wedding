const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true },
    availableDate: { type: Date, required: true, index: true },
    isBooked: { type: Boolean, default: false },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    maxGuests: { type: Number, default: 0 },
    note: { type: String },
}, { timestamps: true });

scheduleSchema.index({ providerId: 1, availableDate: 1 }, { unique: true });

module.exports = mongoose.model("Schedule", scheduleSchema);