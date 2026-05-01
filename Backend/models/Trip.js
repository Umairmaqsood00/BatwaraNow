const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a trip name'],
        trim: true
    },
    participants: {
        type: [String],
        required: [true, 'Please add participants']
    }
}, {
    timestamps: true // Automatically creates createdAt and updatedAt fields
});

module.exports = mongoose.model('Trip', TripSchema);
