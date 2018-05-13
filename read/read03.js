//var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var path= require('path');
var { JSDOM } = require('jsdom');
const url = require('url');

var options = {
    //url: "https://example.org/",
    referrer: "https://example.com/",
    runScripts: "outside-only",
    //contentType: "text/html",
    userAgent: "Mellblomenator/9000",
    includeNodeLocations: true
  };
const output = '../output/';
var g = {
    //mailTo: "ah@joeschedule.mailgun.org,mastronardif@gmail.com,jimmy@joeschedule.mailgun.org",
    mailTo:  "ah@joeschedule.mailgun.org",
    mailBcc: "jimmy@joeschedule.mailgun.org",
    subject: "Test(js) joemailweb.",
    tagOpen: "%26lttags img=keep%26gt<tags img=keep>",
    tagClose: "</tags> %26lt%3B%2Ftags%26gt",
    mystyleDone: false,
    baseHRef: "tbd"
    //baseUrl: "https://slashdot.org" //marketwatch.com" //; //"http://www.drudgereport.com" //"http://joeschedule.com" //"https://stackoverflow.com"    
};

var test = ["http://www.drudgereport.com", 
'https://slashdot.org/',
"https://www.w3schools.com/jsref/dom_obj_textarea.asp",
'https://www.techrepublic.com/article/how-to-get-a-job-in-cloud-computing-10-skills-to-master/',
'https://www.techrepublic.com/article/how-to-get-a-job-in-cloud-computing-10-skills-to-master/&ct=ga&cd=CAEYASoUMTc0MzU1ODExMzM3MTU5MjM4OTAyHDkwMjI3NTZiN2E3MmQ2Yjg6Y29tOmVuOlVTOlI&usg=AFQjCNH5q1Kcxm05dxfHkCpa6RyzVvgRvQ',
'https://www.google.com/url?rct=j&sa=t&url=https://www.techrepublic.com/article/how-to-get-a-job-in-cloud-computing-10-skills-to-master/&ct=ga&cd=CAEYASoUMTc0MzU1ODExMzM3MTU5MjM4OTAyHDkwMjI3NTZiN2E3MmQ2Yjg6Y29tOmVuOlVTOlI&usg=AFQjCNH5q1Kcxm05dxfHkCpa6RyzVvgRvQ'
];

//var gurl = "https://marketwatch.com"; // 'https://slashdot.org/';//'https://slashdot.org/'; //'http://www.drudgereport.com/'; //'https://slashdot.org/';//'http://www.imdb.com/title/tt1229340/';
g.Url=  test[1]; //'https://nodejs.org/docs/latest/api/url.html#url_url_protocol'; //"https://marketwatch.com"; //"https://slashdot.org";
g.baseHRef= myGetBaseRef(test[1]); //'https://www.w3schools.com/jsref/';//test[1]; //'http://www.drudgereport.com';//'https://slashdot.org/';//'https://nodejs.org/docs/latest/api/';
g.protocol= url.parse(g.Url).protocol ? url.parse(g.Url).protocol : 'https';

//getUrl(g.Url);
var testType = {outType: 'file', path: '../output/html2.html'};
//var testType = {outType: 'default'};

readUrl(g.Url, testType);

function readUrl(url, output) {
	getUrl(url, output);	
}

function myGetBaseRef(url) {
    var myRe = /.*\//;
    var baseRef = myRe.exec(url);

    if (baseRef[0] === "https://" || baseRef[0] === "http://") {
        baseRef = url;
    }
    console.log('baseRef= '+ baseRef);
    
    return baseRef;
}

function getUrl(url, output) {
    // The URL we will scrape from - in our example Anchorman 2.

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){

            const dom = new JSDOM(html);
            var document = dom.window.document;
            var head = dom.window.document.getElementsByTagName('head')[0];
            var base_url = dom.window.location.origin;
            console.log(`base_url = ${base_url}`)
            head.append(JSDOM.fragment(
                `\n<style type="text/css" media="screen">\n`+
                `a:link {color:#ff0000;}\n`+
                `a:visited {color:#0000ff;}\n`+
                `a:hover {color:#ffcc00;}\n`+
                `</style>\n`));

            cleanup(document);
            //var $ = cheerio.load(html);
            // F    inally, we'll define the variables we're going to capture
    // var title, release, rating;
    //         var json = { title : "", release : "", rating : ""};

            bobo('html.html', html);
            //bobo('../output/html2.html', dom.serialize() );
			switch (output.outType) {
				case 'file':
					//bobo('../output/html2.html', html);
					bobo(output.path,  dom.serialize());
					break;
				case 'response':
					output.res.send( dom.serialize());			
					break;			
		
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
        var pageBaseUrl=g.baseHRef; //'ROOT/';
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
        //console.log('1____________________________ '+ hrefAttrValue);
        hrefAttrValue = g.protocol + hrefAttrValue;
        //console.log('1____________________________ '+ hrefAttrValue);
    }
    else if ((hrefAttrValue.indexOf('/')==0) || (hrefAttrValue.indexOf('/')==-1) ) {
        //console.log('2____________________________ '+ hrefAttrValue);
        hrefAttrValue = g.baseHRef + hrefAttrValue;
        //console.log('2____________________________ '+ hrefAttrValue);
    }
   

    // const myURL2 = url.parse(hrefAttrValue);
    // if (myURL2.hostname) {
    //     const myURL = new url.URL(hrefAttrValue);
    //     console.log(`\t myURL.host=${myURL.host}`);
    //     console.log(`\t myURL.hostname=${myURL.hostname}`);
    //     console.log(`\t ${myURL.href}`);
    // }
    // else {
    //     console.log(`\t myURL2=${JSON.stringify(myURL2)}`);
    //     //if (myURL2.pathname)
    // }
    
    var url2 = hrefAttrValue;
    var base = pageBaseUrl ? pageBaseUrl : g.baseHRef;//g.baseUrl;
    if (!/^(f|ht)tps?:\/\//i.test(hrefAttrValue)) {
        url2 = base + hrefAttrValue;
     }

    return url2;
  }
function bobo(fn, src) {
    var path = output+ '/'+ fn;        

      fs.writeFile(path, src, (err) => {
        if (err) throw err;

        console.log(`The file ${fn} has been saved!`);
      });
  }
