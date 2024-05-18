const Session = require('../models/session');

const authenticateSession = async (req, res, next) => {
    const sessionId = req.headers['session-id'];

    if (!sessionId) {
        return res.status(401).json({ message: 'Session ID is required' });
    }

    try {
        const session = await Session.findById(sessionId);

        if (!session) {
            return res.status(401).json({ message: 'Invalid session' });
        }

        // Extend session expiration
        session.createdAt = Date.now();
        await session.save();

        req.session = session;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticateSession;
