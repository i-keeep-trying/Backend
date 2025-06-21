const mongoose = require("mongoose");

const canvasSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shared: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    elements: [{ type: mongoose.Schema.Types.Mixed }],
}, {
    timestamps: true,
});

//Get all canvases for a user both owned and shared
canvasSchema.statics.getCanvases = async function(email) {
    const user = await this.model("User").findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }
    const canvases = await this.find({
        $or: [
            { owner: user._id },
            { shared: user._id }
        ]
    }).populate("owner", "email").populate("shared", "email");
    return canvases;
};

module.exports = mongoose.model("Canvas", canvasSchema);
