'use strict';
//var util = require('util');
//var session = require('client-sessions');
//var assert = require('assert');

module.exports.ping = function (req, res) {
    console.log("ping-controller.ping");
    console.log(req.params);
    //console.log(req);
    console.log(JSON.stringify(req.body) );
    var results = {'query': req.query, 'body':req.body};
    res.json(results);
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));
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
