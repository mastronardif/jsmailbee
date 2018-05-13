'use strict';
var readHelp       = require('../read/readHelpers');

module.exports.read = function (req, res) {
    console.log(req.params);
    //console.log(req);
    console.log(JSON.stringify(req.body) + "\n"+ req.body.tagurl );
    
    readHelp.test(req.body.tagurl);

    var results = {'query': req.query, 'body':req.body};
    //res.json(results);
    res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));

    //replyController.mailStore(req, res);
};
