const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    role: { type: String, default: "admin" },
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.matchPassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};

adminSchema.set("toJSON", {
    transform: (_, ret) => { delete ret.password; return ret; }
});

module.exports = mongoose.model("Admin", adminSchema);
