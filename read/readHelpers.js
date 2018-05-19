'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path= require('path');
var { JSDOM } = require('jsdom');
const url = require('url');

// constant data
const KconfigFN = './public/css/mystamp.css';
var cssStamp = "";
try {  
    cssStamp = fs.readFileSync(KconfigFN, 'utf8');
//    console.log(cssStamp);    
} catch(e) {
    console.log('Error:', e.stack);
}
// var options = {
//     //url: "https://example.org/",
//     referrer: "https://example.com/",
//     runScripts: "outside-only",
//     //contentType: "text/html",
//     userAgent: "Mellblomenator/9000",
//     includeNodeLocations: true
//   };

var g = {
    mailTo:  "ah@joeschedule.mailgun.org",
    mailBcc: "jimmy@joeschedule.mailgun.org",
    subject: "Test(js) joemailweb.",
    tagOpen: "%26lttags img=keep%26gt<tags img=keep>",
    tagClose: "</tags> %26lt%3B%2Ftags%26gt",
    mystyleDone: false,
    baseHRef: "tbd",
    protocol: "tbd",
    cssStamp: cssStamp
};

var outputType = {outType: 'file', path: './uploads/'};
module.exports.test = function (src) {
    //console.log("readHelpers.test", src);
    var Url = src;
    g.baseHRef= myGetBaseRef(Url); 
    g.protocol= url.parse(Url).protocol ? url.parse(Url).protocol : 'https';

    readUrl(Url, outputType);
};

function readUrl(url, output) {
	getUrl(url, output);	
}

function myGetBaseRef(url) {
    var myRe = /.*\//;
    var baseRef = myRe.exec(url);

    if (baseRef && (baseRef[0] === "https://" || baseRef[0] === "http://") ) {
        baseRef = url;
    }
  
    return baseRef;
}

function getUrl(url, output) {
    request(url, function(error, response, html){
        if(!error){

            const dom = new JSDOM(html);
            var document = dom.window.document;
            var head = dom.window.document.getElementsByTagName('head')[0];
            var body = dom.window.document.getElementsByTagName('body')[0];
            var base_url = dom.window.location.origin;

            head.append(JSDOM.fragment(
                `\n<style type="text/css" media="screen">\n`+
                `a:link {color:#ff0000;}\n`+
                `a:visited {color:#0000ff;}\n`+
                `a:hover {color:#ffcc00;}\n`+
                `</style>\n`));

            head.append(JSDOM.fragment(
                `\n<style type="text/css" media="screen">\n`+
                `${g.cssStamp}`+
                `</style>\n`));

            cleanup(document);
            body.append(JSDOM.fragment(`<p class="mbee">Thank you for using`+
            `<br/> Mailbee <br/>`+            
            `<a href="${url}">${url}</a>`+
            `</p>`));
            
            bobo(output.path+'html.html', html);
			switch (output.outType) {
				case 'file':
					bobo(output.path+'html2.html',  dom.serialize());
					break;
				// case 'response':
				// 	output.res.send( dom.serialize());			
				// 	break;			
		
				default:
					console.log( dom.serialize());
			}            
        }
    })
}

function cleanup(document)
{
    document.title = 'mod-'+document.title;

    var element = document.getElementsByTagName("img"), index;
    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    element = document.getElementsByTagName("script"), index;
    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    element = document.getElementsByTagName("noscript"), index;
    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    element = document.getElementsByTagName("iframe"), index;
    for (index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    // the big conhoona
    element = document.getElementsByTagName("a"), index;
    for (index = element.length - 1; index >= 0; index--) {
        var hrefAttrValue=element[index].href;

        var pageBaseUrl=g.baseHRef;
        var uri = makeHttpurl(pageBaseUrl, hrefAttrValue);
        var m2  = makeMailToFromURI(uri);
        element[index].href = m2;
    }
}


function makeMailToFromURI(uri) {
    var emailRoot = g.mailTo;
    var bcc       = g.mailBcc ? "&bcc="+g.mailBcc : "";
    var subject   = g.subject;    
    var tagOpen   = g.tagOpen;    
    var tagClose  = g.tagClose;    

    var results = "mailto:" + emailRoot + "?subject=" + subject +bcc+
    "&body="+ 
    tagOpen +
    uri +
    tagClose;

    return results;
  }
  
  function makeHttpurl(pageBaseUrl, hrefAttrValue) { 
    if (hrefAttrValue.indexOf('//') == 0) {
        hrefAttrValue = g.protocol + hrefAttrValue;
    }
    else if ((hrefAttrValue.indexOf('/')==0) || (hrefAttrValue.indexOf('/')==-1) ) {
        hrefAttrValue = g.baseHRef + hrefAttrValue;
    }
    
    var url2 = hrefAttrValue;
    var base = pageBaseUrl ? pageBaseUrl : g.baseHRef; //g.baseUrl;
    if (!/^(f|ht)tps?:\/\//i.test(hrefAttrValue)) {
        // remove leading //'s
        //hrefAttrValue = hrefAttrValue.replace(/^\/+/g, '');
        url2 = base + hrefAttrValue;
    }
     
    return url2;
}

function bobo(path, src) {
      fs.writeFile(path, src, (err) => {
        if (err) throw err;

        console.log(`The file ${path} has been saved!`);
      });
  }
