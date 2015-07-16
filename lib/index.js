'use strict';

var restify = require('restify'),
    db = require('./db'),
    server;

// Private.

function handleGETUserId(req, res, next) {
    console.log('--> getting wallet for ' + req.params.user_id);
    db.hgetall(req.params.user_id,
        function (result, content) {
            if (result === 'found') {
                // Found wallet for user id.
                console.log('<-- serving 200 (found):', content);
                res.send(200, content);
            } else {
                // Did not find wallet for user id.
                console.log('<-- serving 404 (not found)');
                res.send(404);
            }

            return next();
        });
}

function handleGETUserIdWalletItem(req, res, next) {
    console.log('--> getting wallet item ' + req.params.item_id + ' for user ' + req.params.user_id);
    db.hget(req.params.user_id, req.params.item_id,
        function (result, content) {
            if (result === 'found') {
                // Found wallet item for user id.
                console.log('<-- serving 200 (found):', content);
                res.send(200, content);
            } else {
                // Did not find either user id or wallet item for user id.
                console.log('<-- serving 404 (not found)');
                res.send(404);
            }

            return next();
        });
}

function handlePUTUserIdWalletItem(req, res, next) {
    console.log('--> upserting wallet item ' + req.params.item_id + ' for user ' + req.params.user_id);
    db.hset(req.params.user_id, req.params.item_id, req.body,
        function (result) {
            if (result === 'created') {
                // Created wallet item for user id.
                console.log('<-- serving 201 (created)');
                res.send(201);
            } else if (result === 'updated') {
                // Updated wallet item for user id.
                console.log('<-- serving 204 (updated)');
                res.send(204);
            } else {
                // Unexpected error.
                console.log('<-- serving 409 (conflict)');
                res.send(409);
            }

            return next();
        });
}

// REST API - init.

server = restify.createServer({
    name: 'wallet'
});
server.use(restify.bodyParser());
server.pre(restify.pre.sanitizePath());
server.on('uncaughtException', function (req, res, err) {
    console.error('[', req.route.path, '] uncaught exception', err);
    //console.trace('Error request:', req);
    //console.trace('Error response:', res);

    res.send(500);
});
server.listen(8080, function () {
    console.log('Server ' + server.name + ' listening on ' + server.url);
});

// REST API - routes.

server.get('/v1/wallet/:user_id/', handleGETUserId);
server.get('/v1/wallet/:user_id/:item_id', handleGETUserIdWalletItem);
server.put('/v1/wallet/:user_id/:item_id', handlePUTUserIdWalletItem);
