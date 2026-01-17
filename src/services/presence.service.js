const redis = require('../config/redis');

const setOnline = async (userId, socketId) => {
    await redis.set(`online:${userId}`, socketId);
}

const setOffline = async (userId) => {
    await redis.del(`online:${userId}`);
}

const getSocketId = async (userId) => {
    return await redis.get(`online:${userId}`);
}

module.exports = {
    setOnline,
    setOffline,
    getSocketId,
};