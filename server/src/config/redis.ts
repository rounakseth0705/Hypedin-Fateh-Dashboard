// import { Redis } from "ioredis";

// const redis = new Redis({
//     host: process.env.REDIS_HOST as string,
//     port: Number(process.env.REDIS_PORT),
//     maxRetriesPerRequest: 3,
//     retryStrategy(times) {
//         return Math.min(times * 100, 3000);
//     }
// });

// redis.on("error", (error: unknown) => {
//     if (error instanceof Error) {
//         console.log(error.message);
//     } else {
//         console.log("Unknown Error:", error);
//     }
// });

// redis.on("close", () => {
//     console.log("Redis connection closed");
// });

// export const connectToRedis = async (): Promise<boolean> => {
//     try {
//         await redis.ping();

//         console.log("Redis connected");
        
//         return true;
//     } catch(error: unknown) {
//         if (error instanceof Error) {
//             console.log(error.message);
//         } else {
//             console.log("Unknown Error:", error);
//         }

//         return false;
//     }
// }

// export default redis;