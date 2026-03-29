const Provider = require("../models/Providers");

// GET /api/providers
exports.getProviders = async (req, res) => {
    try {
        const { serviceType } = req.query;
        const filter = {};

        if (serviceType) {
            const allowedServiceTypes = ["food", "photo", "music"];
            if (!allowedServiceTypes.includes(serviceType)) {
                return res.status(400).json({ message: "Invalid serviceType" });
            }
            filter.serviceType = serviceType;
        }

        const providers = await Provider.find(filter).sort({ createdAt: -1 });
        res.json(providers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/providers/me
exports.getMyProviderProfile = async (req, res) => {
    try {
        const provider = await Provider.findById(req.user.id);
        if (!provider) return res.status(404).json({ message: "Provider not found" });
        res.json(provider);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /api/providers/me/pricing
exports.updateMyProviderPricing = async (req, res) => {
    try {
        const nextPrice = Number(req.body.price);
        if (!Number.isFinite(nextPrice) || nextPrice < 0) {
            return res.status(400).json({ message: "Invalid price" });
        }

        const existingProvider = await Provider.findById(req.user.id);
        if (!existingProvider) return res.status(404).json({ message: "Provider not found" });
        if (existingProvider.serviceType === "food") {
            return res.status(403).json({ message: "Food provider cannot update pricing" });
        }

        const provider = await Provider.findByIdAndUpdate(
            req.user.id,
            { price: nextPrice },
            { new: true, runValidators: true }
        );

        if (!provider) return res.status(404).json({ message: "Provider not found" });
        res.json(provider);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
