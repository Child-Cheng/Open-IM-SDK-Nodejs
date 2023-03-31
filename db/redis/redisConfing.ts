// src/server/redis/redisConfing.ts
import Config from '../../config/index';

export default {
  port: Config.REDIS.PORT, // Redis port
  host: Config.REDIS.HOST, // Redis host
  password: Config.REDIS.PASSWORD,
  db: Config.REDIS.DB,
};
