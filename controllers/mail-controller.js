/* jslint node: true */
'use strict';
//var assert = require('assert');
var json2html = require('node-json2html');
var validator = require('validator');
//var mylib = require('../lib/mylib');

var mg = global.config.Mg;
var admin = global.config.Admin;

var mailgun = require('mailgun-js')({apiKey: mg.api_key, domain: mg.domain});

var g_test = {};
g_test.useMG = process.env.Mg__dontuse ? false : true;

module.exports.pingReply = function (req, res) {
    console.log("mail-controller.pingReply");
    console.log(req.params);
    //console.log(req);
    console.log(JSON.stringify(req.body) );
    var results = {'query': req.query, 'body':req.body};

    var data = {
        from: admin.fromAdmin,
        to: admin.toAdmin,
        subject: admin.subject,
        //text: 'Testing some Mailgun awesomness!',
        text: `${JSON.stringify(results, null, 2)}`
        //attachment: file
        //attachment: attch //[attch,attch] 
        //inline: file
      };
    if (g_test.useMG) {
        //data.html = html; //'<h1>Testing some Mailgun awesomness!<h1/>';
        mailgun.messages().send(data, function (error, body) {
        console.log(body);
      
        if (error) {
            console.log('error = ', error);
        }
        else {
            //console.log(body);
            res.send(body);
        }
        });
      } // end debug
      else {
          console.log('not doing res.send(htmlResp)');
          res.json(results);
          //res.json({"results":"Not doing MG."}+results);
      }

    //res.json(results);
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));   
};


module.exports.mailStore = function (req, res) {
  //var request = require('request');
  var file;
  file = req.data;
  var filename = "wtf.jpg";

  var data22 =  req.fields;

  console.log("\n\ndata = \n", data22 );
  var htmlResp = json2html.transform(data22, {"f": "u"});
  console.log("htmlResp = ", htmlResp );

  // for each file
  //var attch = new mailgun.Attachment({data: file, filename: filename});

  //console.log('\n\n mailStore file = \n', file); 

  var data = {
    from: admin.fromAdmin,
    to: admin.toAdmin,
    subject: admin.subject,
    //text: 'Testing some Mailgun awesomness!',
    //html: htm,
    //attachment: file
    //attachment: attch //[attch,attch] 
    //inline: file
  };
//   if (req.data.length>12) {
//     data.attachment = attch;
//   }

//
var gpath = require('path');
var fs = require('fs');
//var new_path = gpath.join(process.env.PWD, '/uploads/', 'indexdoggy.html');
var new_path = gpath.join(process.env.PWD, '/uploads/', 'html2.html');

console.log('\n\n new_path = \n', new_path);

console.log(`\n\n *new_path = ${__filename} \n', ${new_path}`);
var html = fs.readFileSync(new_path).toString(); 
//console.log("html=", html);
//
if (g_test.useMG) {
  data.html = html || 'Something went wrong. :( with the fs.read ,aybe a timing issue....'; //'<h1>Testing some Mailgun awesomness!<h1/>';
  mailgun.messages().send(data, function (error, body) {
    if (error) {
      console.log('error = ', error);
    }
    else {
      console.log(body);
    }
    res.json(body);
  });
} // end debug
else {
    console.log('not doing res.send(htmlResp)');
    res.json({"results":"Not doing MG."});    
}

};

/****************
module.exports.reply = function (req, res) {
    console.log("reply-controller.reply");
    //console.log(req.params);
    
    //console.log(req);
    var data =  req.body;
    //console.log(JSON.stringify(req.body) );
    //console.log("\n________________________\n" );
    //console.log("\n________________________\n\n" );
    
    var cc = (req.body.email) ? req.body.email : "";
    if (validator.isEmail(cc)) {
        cc = req.body.email;
    }    
    
    //var transform = {"<>":"div","html":"${name} likes ${email}"};
    var transform = [{"<>":"p","html":[
    {"<>":"span","html":"	What you said: <br/> <br/>"},
    {"<>":"span","html":"	Name:  ${name}"},
    {"<>":"br","html":""},
    {"<>":"span","html":"Email: ${email}"},
    {"<>":"br","html":""},
    {"<>":"span","html":"Note: ${notes}"}
  ]},
  {"<>":"ul","html":[
      {"<>":"li","html":"${days}"}
    ]},
    
   {"<>":"span","html":" <br/> <br/>A Walker will get back to you."},
   {"<>":"span","html":" <br/> <br/>Sincerely, <br/><br/> <hr/>Westfield Dog walkers"},
   {"<>":"span","html":" <br/> <br/>FM"},
        
  {"<>":"p","html":""}
]
  ;
    
    var html = json2html.transform(data,transform);
    console.log("html = ", html );
    
    // send email to _________ Fm, and User.
    // begin mailgun

    var to = admin.toAdmin;
    
    //mylib.log();
    //validator.isEmail('foo@bar.com');
    console.log(data.email);
    console.log('cc(', cc, ')');
    if (cc)
    {
        console.log('cc(', cc, ')');
    }

    
data = {
  from: admin.fromAdmin,
  to: to, //to: 'serobnic@mail.ru',
  //cc: cc,
  subject: admin.subject,
  html: html //'Testing some Mailgun awesomness!'
  //text: html //'Testing some Mailgun awesomness!'
};
console.log("data = ", data);
if (cc) {
    data.cc = cc;
}
console.log("data = ", data);
 
mailgun.messages().send(data, function (error, body) {
    if (error) {
        console.log('error = ', error);
    }
    else {
        console.log(body);
    }
});
    // end mailgun
   
    var results = {'query': req.query, 'body':req.body};
    //res.json(results);
    res.send(html);
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));
};

// tellafriend
module.exports.replyTellAFriend = function (req, res) {
    console.log("reply-controller.reply");
    //console.log(req.params);
    
    //console.log(req);
    var data =  req.body;
    console.log(JSON.stringify(req.body) );
    var cc = (req.body.email) ? req.body.email : "";
    if (validator.isEmail(cc)) {
        cc = req.body.email;
    }    
    
    //var transform = {"<>":"div","html":"${name} likes ${email}"};
    var transform = [{"<>":"p","html":[
    {"<>":"span","html":"	Hello checkout <br/> <br/>"},

    {"<>":"br","html":"Westfield Area Dog Walkers/Sitters."},
  
  {tag: "a",  
href: "/doggy", 
style: "float: right;", 
html: "doggy"}

    
    //{"<>":"p","html":"check out Dog Walkers Sitters in Westfield Area at <a href='/asdf'}
    
  ]},
   {"<>":"span","html":" <br/> <br/>Sincerely, <br/><br/> <hr/>${nameMy}"},
   {"<>":"span","html":" <br/> ${emailMy}"},
   {"<>":"span","html":" <br/><br/> Westfield Dog walkers"},
   {"<>":"span","html":" <br/>FM"},
        
  {"<>":"p","html":""}
]
  ;
    
    var html = json2html.transform(data,transform);
    console.log("html = ", html );
    
    // send email to _________ Fm, and User.
    // begin mailgun

    var to = admin.toAdmin;
    
    //mylib.log();
    //validator.isEmail('foo@bar.com');
    console.log(data.email);
    console.log('cc(', cc, ')');
    if (cc)
    {
        console.log('cc(', cc, ')');
    }

    
data = {
  from: admin.fromAdmin,
  to: to, //to: 'serobnic@mail.ru',
  //cc: cc,
  subject: admin.subject,
  html: html 
  //text: html //'Testing some Mailgun awesomness!'
};
console.log("data = ", data);
if (cc) {
    data.cc = cc;
}
console.log("data = ", data);
 
mailgun.messages().send(data, function (error, body) {
    if (error) {
        console.log('error = ', error);
    }
    else {
        console.log(body);
    }
});
    // end mailgun
   
    var results = {'query': req.query, 'body':req.body};
    //res.json(results);
    res.send(html);
    //res.send('echo '+ JSON.stringify(req.query) + JSON.stringify(req.body));
};
};
******/
//print out error messages
function printError(error){
  console.error(error.message);
}


 