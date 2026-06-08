import { createClient, RedisClientType } from "redis";

const client: RedisClientType = createClient();

function connectRedis(client: RedisClientType) {
  client.on("error", (err) => console.log("Redis Client Error", err));
  client.on("connect", () => console.log("Redis connected"));
  client.connect();

  return client;
}

export const redisClient = connectRedis(client);
