/*
author: kevin 2019
*/

var redisClient = {};
var redis = require("redis");

redisClient.init = function (cfg) {
    var client = redis.createClient(cfg.redis);
    client.select(cfg.redis.database);

    client.on("error", function (err) {
        console.log("Error :", err);
    });

    client.on('connect', function () {
        console.log('Redis connected：' + cfg.redis.host + ':' + cfg.redis.port);
    });

    this.client = client;
}

redisClient.set = function (key, value, expire, callback) {
    let that = this;
    that.client.set(key, value, function (err, result) {

        if (err) {
            console.log(err);
            if (callback) callback(err, null);
            return;
        }

        if (!isNaN(expire) && expire > 0) {
            that.client.expire(key, parseInt(expire));
        }

        if (callback) callback(null, result)
    })
}

redisClient.get = function (key, callback) {
    let that = this;
    that.client.get(key, function (err, result) {

        if (err) {
            console.log(err);
            if (callback) callback(err, null)
            return;
        }

        if (callback) callback(null, result);
    });
}

module.exports = redisClient; 