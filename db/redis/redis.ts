// src/server/redis/redis.ts
import redisConfing from './redisConfing';
import ioreDis from 'ioredis';
import config from '../../config/index';
export default config.continuous_dialogue
  ? new ioreDis(redisConfing)
  : new Object();
