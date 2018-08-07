import { v4 } from "uuid";
import {Redis} from "ioredis"

export const createConfrimEmailLink = async (url: string, userId: string, redis: Redis) => {
  const id = v4();

  /**
   * @param ex: Expirery date 
   */
  await redis.set(id, userId, "ex", 60*60*24);
  return `${url}/confirm/${id}`
};
