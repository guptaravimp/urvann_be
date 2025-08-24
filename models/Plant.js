const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
    plantName: {
        type: String,
        required: true,
    },
    plantPrice: {
        type: Number,
        required: true,
    },
    plantImage: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/dx0ooqk4w/image/upload/v1755953059/techravibusiness/fpqaozukagdwyregx1zz.webp",
    },
    plantDescription: {
        type: String,
    },
    plantCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    plantAvailability: {
        type: String,
        default: "In Stock",
    },
    
}, { timestamps: true });

module.exports = mongoose.model("Plant", PlantSchema);