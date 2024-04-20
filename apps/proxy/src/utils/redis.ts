import { env } from "@/config"
import { createClient, RedisClientType } from "redis"
const redisClient: RedisClientType = createClient({
    url: env.REDIS_URL
})
redisClient.on("error", (error) => {
    console.error(error)
})
redisClient.connect()

export const redis = redisClient