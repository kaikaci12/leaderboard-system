"use strict";
exports.__esModule = true;
exports.redisClient = void 0;
var redis_1 = require("redis");
var client = (0, redis_1.createClient)();
function connectRedis(client) {
    client.on("error", function (err) { return console.log("Redis Client Error", err); });
    client.connect();
    return client;
}
exports.redisClient = connectRedis(client);
