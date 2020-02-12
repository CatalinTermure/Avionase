const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');
var fs = require('fs');

/** Create a new Pusher client and configure it to connect to our Pusher application
 * "./pusher.json" -> filename for the pusher config(app, key, secret, cluster, encrypted)
*/
const pusherConfig = require('./pusher.json');
const pusherClient = new Pusher(pusherConfig);

const app = express(); /** Create a new express server, needs body-parser */
app.use(bodyParser.json());

const testing = true;

var users = require('./users.json').users; // TODO: Order users for logarithmic time complexity
var friends = require('./friends.json').friends; // TODO: Order friends for logarithmic time complexity
var online = [];
var friendreq = require('./friends.json').req;
var queue = [];

/**
 * Add a new route - PUT /users/:name.
 * This will send a join message to the Pusher application with the name of the user that has joined as the payload.
 * lambda -> function(request, response)
 * seems like "/users/:name" makes request param "name" for req.params.name
 * "join" and "chat_channel" are customisable
 * usage: "METHOD: PUT  REQUEST URL: http://localhost:4000/users/($name)"
 */

app.put("/save", function (req, res) {
    console.log('Saving data...');
    fs.writeFile('./users.json', JSON.stringify({ "users": users }), 'utf8', (err) => { console.log(err) });
    fs.writeFile('./friends.json', JSON.stringify({ "friends": friends, "req": friendreq }), 'utf8', (err) => { console.log(err) });
    res.sendStatus(200);
    pusherClient.trigger('test-channel', 'test-event', {
        "message": "Saved successfully!"
    });
});

/**
 * Add a new route - DELETE
 * same as PUT
 */


/**
 * Add a new route - POST
 * same as PUT
 * NEEDS .JSON PACKAGE!
 * usage "METHOD: POST    REQUEST URL: http://localhost:4000/users/($name)/messages   JSON: { "message": "($message)" }"
 * req.body controls the JSON package on the body, change req.body.message takes the "message" variable from the JSON
 */

app.post('/login', function (req, res) { // TODO: Order users and friends for logarithmic time complexity
    console.log("User " + req.body.user + " tried to login with password " + req.body.password);
    let status = 404;
    users.forEach((user) => {
        if (user.name == req.body.user && user.pass == req.body.password) {
            status = 200;
        }
    });
    let onlinearr = [];
    online.forEach((user) => {
        onlinearr.push(user);
        if (user == req.body.user && !testing) {
            status = 403;
        }
    });
    if (status == 200) {
        online.push(req.body.user);
        onlinearr.push(req.body.user);
        let requests = [];
        let friendarr = [];
        friendreq.forEach((request) => {
            if (request.b == req.body.user) {
                requests.push(request.a);
            }
        });
        friends.forEach((relationship) => {
            if (relationship.a == req.body.user) {
                friendarr.push(relationship.b);
            }
            else if (relationship.b == req.body.user) {
                friendarr.push(relationship.a);
            }
        });
        pusherClient.trigger('main-channel', 'online-event', { user: req.body.user });
        console.log("Login successful.");
        res.status(status).send({ "req": requests, "friends": friendarr, "online": onlinearr });
    }
    else {
        res.sendStatus(status);
    }
});

app.post('/register', function (req, res) { // TODO: Order users for logarithmic time complexity
    console.log("User " + req.body.user + " registered with password " + req.body.password);
    let status = 200;
    users.forEach((user) => {
        if (user.name == req.body.user) {
            status = 403;
            console.log("ERROR: Conflicting username.");
        }
    });
    if (status == 200) {
        users.push({ "name": req.body.user, "pass": req.body.password })
        console.log("Register successful!");
    }
    res.sendStatus(status);
});

app.post('/queue', (req, res) => {
    console.log("User " + req.body.user + " has entered the queue");
    if (queue.length > 0) {
        pusherClient.trigger('main-channel', 'start-event', { user1: queue[0], user2: req.body.user });
        queue.pop();
    }
    else {
        queue.push(req.body.user);
    }
    res.sendStatus(200);
});

app.post('/gamestart', (req, res) => {
    console.log("Game started between " + req.body.user1 + " and " + req.body.user2);
    pusherClient.trigger('main-channel', 'start-event', { user1: req.body.user1, user2: req.body.user2 });
    res.sendStatus(200);
});

app.post('/friendreq', function (req, res) { // TODO: Order friends for logarithmic time complexity
    console.log("User " + req.body.a + " has requested to be friends with user " + req.body.b);
    friendreq.push({ "a": req.body.a, "b": req.body.b });
    pusherClient.trigger('main-channel', 'request-event', { target: req.body.b, user: req.body.a })
    res.sendStatus(200);
});

app.post('/friendacc', function (req, res) {
    console.log("User " + req.body.a + " accepted the friend request from " + req.body.b);
    friends.push({ "a": req.body.a, "b": req.body.b });
    pusherClient.trigger('main-channel', 'accept-event', { target: req.body.a, user: req.body.b });
    res.sendStatus(200);
});

app.post('/logout', (req, res) => {
    console.log("User " + req.body.user + " has left.");
    for (var i = 0; i < online.length; i++) {
        if (online[i] == req.body.user) {
            online.splice(i, 1);
        }
    }
    res.sendStatus(200);
});

/**
 * Make app listen to port 4000, idk if i want to change it, seems like there isn't anything bad with it
 */
app.listen(4000, function () {
    console.log('App listening on port 4000');
});

