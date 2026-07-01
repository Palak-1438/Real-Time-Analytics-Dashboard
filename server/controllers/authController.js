const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({ status: 'success', data: result });
        } catch (error) {
            res.status(400).json({ status: 'error', message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            res.status(401).json({ status: 'error', message: error.message });
        }
    }

    async getMe(req, res) {
        try {
            // req.user is set by authMiddleware
            res.status(200).json({ status: 'success', data: { user: req.user } });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Server error' });
        }
    }
}

module.exports = new AuthController();
