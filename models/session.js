const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now, expires: '7d' } // Expires after 7 days of inactivity
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
