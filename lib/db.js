'use strict';

var redis = require('redis'),
    client = redis.createClient();

// Private.

function hget(key, field, cb) {
    // HGET key field
    client.hget(key, field, function (err, reply) {
        if (err) {
            cb('error');
        } else if (reply === null) {
            cb('not_found');
        } else {
            cb('found', reply);
        }
    });
}

function hgetall(key, cb) {
    // HGETALL key
    client.hgetall(key, function (err, reply) {
        if (err) {
            cb('error');
        } else if (reply === null) {
            cb('not_found');
        } else {
            cb('found', reply);
        }
    });
}

function hset(key, field, value, cb) {
    // HSET key field value
    client.hset(key, field, value, function (err, reply) {
        if (err) {
            cb('error');
        } else if (reply === 1) {
            cb('created');
        } else {
            cb('updated');
        }
    });
}

client.on('error', function (err) {
    console.error('[redis]', err);
});

// Public.

module.exports = {
    hget: hget,
    hgetall: hgetall,
    hset: hset
};

