'use strict';

//var util = require('util');
//var session = require('client-sessions');
//var assert = require('assert');
var replyController = require('./reply-controller');
module.exports.ping = function (req, res) {
    console.log("ping-controller.ping");
    console.log(req.params);
    //console.log(req);
    console.log(JSON.stringify(req.body) );
    var results = {'query': req.query, 'body':req.body};
    res.json(results);
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));
    replyController.mailStore(req, res);
};
module.exports.pingLemur = function (req, res) {
    console.log("ping-controller.pingLemur");
    console.log(req.params);
    //console.log(req);
    console.log(JSON.stringify(req.body) );

    var postData = 
    {
        "properties":{},
        "routing_key":"task_queue",
        "payload":`"<tag>${req.body.tagurl}}</tag>"`,
        "payload_encoding":"string"
    };
    //var results = {'query': req.query, 'body':req.body};
    //res.json(results);
    //var http = require("https");
    var request = require('request');
    var options = {
      "method": "POST",
      "hostname": "wasp.rmq.cloudamqp.com",
      "port": null,
      "path": "/api/exchanges/pyxvbrth/amq.default/publish",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        'Content-Length': postData.length,
        "cache-control": "no-cache"
      },
      json: postData
    };
    
    request.post(
        'https://pyxvbrth:o3f6R_94tCWiRMYUL5KrZPHEVo6Foz5y@wasp.rmq.cloudamqp.com/api/exchanges/pyxvbrth/amq.default/publish',
        { json: postData },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
            res.json(body);
        }
    );


};

module.exports.pingjp = function (req, res) {
    console.log("pingjp-controller");
    console.log(req.query.callback);
    var cb = req.query.callback ? req.query.callback : "callback";
    
    //console.log(req);
    //console.log(JSON.stringify(req.body) );
    var data = [{"LEFT": "rrrr"}, {"FRONT": "back"}]
    var retval = cb+'('+JSON.stringify(data)+')';
    res.send(retval); //'callback([{"LEFT": "rrrr"}, {"FRONT": "back"}])');
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));
};

module.exports.pingcors = function (req, res) {
    console.log(req.query);
    //console.log(req);
    console.log(JSON.stringify(req.body) );
    var results = {'query': req.query, 'body':req.body};
    
    if ('cors' == 'cors') {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');  
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
   
    res.json(results);
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));
};

//print out error messages
function printError(error){
  console.error(error.message);
};
