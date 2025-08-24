const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("File", FileSchema);
