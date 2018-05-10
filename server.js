var express = require("express");
var bodyp   = require('body-parser');
var app = express();
var router = express.Router();
var fs = require('fs');
var gpath = require('path');


var path = __dirname + '/views/';
var pathUploads = __dirname + '/uploads/';
global.config = {};//for Heroku require('./config/default.json');
var replyController = require('./controllers/reply-controller');
var pingController = require('./controllers/ping-controller');

console.log(__dirname);

app.use(bodyp.urlencoded({ extended: false }));
app.use(bodyp.json());

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/uploads'));

router.get("/mylist",function(req,res){
  res.sendFile(path + "thelist.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});



//router.all ('/pingcors', pingController.pingcors);
router.all ('/ping', pingController.ping);
//router.get ('/pingjp', pingController.pingjp);
//app.all ('/ping',stormpath.loginRequired, pingController.ping);console.log(req.query);

app.use("/",router);

app.use("*",function(req,res){
   res.sendFile(path + "404.html");
});

app.listen(app.get('port'), function() {
  console.log("Live at Port ", app.get('port'));
});