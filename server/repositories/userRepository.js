const User = require('../models/User');
const { getCache, setCache } = require('../utils/cache');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        const cacheKey = `user:${id}`;

        // Try to get from cache first
        const cachedUser = await getCache(cacheKey);
        if (cachedUser) {
            return User.hydrate(cachedUser);
        }

        // If not in cache, query DB
        const user = await User.findById(id).select('-password');

        // Set in cache for 5 minutes
        if (user) {
            await setCache(cacheKey, user, 300);
        }

        return user;
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }
}

module.exports = new UserRepository();
