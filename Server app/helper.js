const express = require('express');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

/** Create a new Pusher client and configure it to connect to our Pusher application
 * "./pusher.json" -> filename for the pusher config(app, key, secret, cluster, encrypted)
*/ 
const pusherConfig = require('./pusher.json'); 
const pusherClient = new Pusher(pusherConfig);

const app = express(); /** Create a new express server, needs body-parser */
app.use(bodyParser.json());

/**
 * Add a new route - PUT /users/:name.
 * This will send a join message to the Pusher application with the name of the user that has joined as the payload.
 * lambda -> function(request, response)
 * seems like "/users/:name" makes request param "name" for req.params.name
 * "join" and "chat_channel" are customisable
 * usage: "METHOD: PUT  REQUEST URL: http://localhost:4000/users/($name)"
 */
app.put('/users/:name', function(req, res) {
    console.log('User joined: ' + req.params.name);
    pusherClient.trigger('chat_channel', 'join', {
        name: req.params.name
    });
    res.sendStatus(200);
});

/**
 * Add a new route - DELETE
 * same as PUT
 * usage: "METHOD: DELETE  REQUEST URL: http://localhost:4000/users/($name)"
 */
app.delete('/users/:name', function(req, res) {
    console.log('User left: ' + req.params.name);
    pusherClient.trigger('chat_channel', 'part', {
        name: req.params.name
    });
    res.sendStatus(200);
});

/**
 * Add a new route - POST
 * same as PUT
 * NEEDS .JSON PACKAGE!
 * usage "METHOD: POST    REQUEST URL: http://localhost:4000/users/($name)/messages   JSON: { "message": "($message)" }"
 * req.body controls the JSON package on the body, change req.body.message takes the "message" variable from the JSON
 */
app.post('/users/:name/messages', function(req, res) {
    console.log('User ' + req.params.name + ' sent message: ' + req.body.message);
    pusherClient.trigger('chat_channel', 'message', {
        name: req.params.name,
        message: req.body.message
    });
    res.sendStatus(200);
});

/**
 * Make app listen to port 4000, idk if i want to change it, seems like there is a certain virus on that port "SkyDance"
 */
app.listen(4000, function() {
    var channel = pusherClient.subscribe('test-channel');
    channel.bind('test-event', function(data) {
        console.log(data.message);
    })
    console.log('App listening on port 4000');
});

