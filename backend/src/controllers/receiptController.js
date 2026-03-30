const Receipt = require("../models/Receipt");

// GET /api/receipts (Admin)
exports.getAllReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find()
            .populate("customerId", "username email")
            .populate("bookingId", "venueName eventDate")
            .populate("paymentId", "amount status transferDate")
            .populate("issuedBy", "username email")
            .sort({ issuedAt: -1 });

        res.json(receipts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};