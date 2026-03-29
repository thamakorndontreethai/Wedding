const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String },
    address: { type: String },
}, { timestamps: true });

customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

customerSchema.methods.matchPassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};

customerSchema.set("toJSON", {
    transform: (_, ret) => { delete ret.password; return ret; }
});

module.exports = mongoose.model("Customer", customerSchema);