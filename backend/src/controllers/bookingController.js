const Booking = require("../models/Booking");
const Schedule = require("../models/Schedules");
const mongoose = require("mongoose");

// POST /api/bookings
exports.createBooking = async (req, res) => {
    try {
        const {
            packageId,
            venueId,
            venueName,
            eventDate,
            weddingDate,
            guestCount,
            mealType,
            addFood,
            addPhoto,
            addMusic,
            totalPrice,
            depositAmount,
            remainingAmount,
            notes,
            musicProviderId,
            customServices,
        } = req.body;

        const normalizedPackageId = mongoose.Types.ObjectId.isValid(packageId)
            ? packageId
            : new mongoose.Types.ObjectId();
        const normalizedVenueId = mongoose.Types.ObjectId.isValid(venueId)
            ? venueId
            : new mongoose.Types.ObjectId();
        const normalizedEventDate = eventDate || weddingDate;

        if (!normalizedEventDate) {
            return res.status(400).json({ message: "eventDate is required" });
        }

        const booking = await Booking.create({
            customerId: req.user.id,
            packageId: normalizedPackageId,
            venueId: normalizedVenueId,
            venueName,
            eventDate: normalizedEventDate,
            guestCount,
            mealType,
            addFood: !!addFood,
            addPhoto: !!addPhoto,
            addMusic: !!addMusic,
            totalPrice,
            depositAmount,
            remainingAmount,
            notes,
        });

        // อัปเดต schedule ของ provider
        const selectedMusicProviderId = musicProviderId || customServices?.musicProviderId;
        if (selectedMusicProviderId) {
            await Schedule.findOneAndUpdate(
                { providerId: selectedMusicProviderId },
                { $push: { bookedDates: normalizedEventDate } },
                { upsert: true }
            );
        }

        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// GET /api/bookings/my  (Customer)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customerId: req.user.id })
            .populate("venueId")
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/bookings/:id/status  (Admin)
exports.updateStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};