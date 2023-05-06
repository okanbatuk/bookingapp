import { createClient } from "redis";

// Create a client and connect to Redis with the client
const redisClient = createClient();
(async () => {
  await redisClient.connect();
})();

export default redisClient;
