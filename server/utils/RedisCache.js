// utils/redisCache.js
import RedisClient from './RedisClient.js';

const invalidateCacheGroup = async (groupKey, groupId) => {
    const key = `${groupKey}:${groupId}`;
    await RedisClient.del(key);
};

export default invalidateCacheGroup