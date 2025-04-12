// lib/redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.NEXT_PUBLIC_RADIS_URL!)

export default redis
