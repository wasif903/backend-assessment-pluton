// utils/redisCache.js
import RedisClient from "./RedisClient.js";

const invalidateCacheGroup = async (groupKey, groupId) => {
  const pattern = `${groupKey}:${groupId}:*`; // Match all variations with queryHash
  const keys = await RedisClient.keys(pattern); 
  if (keys.length > 0) {
    await RedisClient.del(...keys);
  } else {
    console.log(`No keys found for pattern: ${pattern}`);
  }
};

export default invalidateCacheGroup;
