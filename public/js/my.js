// my.js 
/*!
 *  my.js 
 */
//alert('my.js');
var mycmd = (function() {
   // your module code goes here
   var sum = 0 ;

   return {
           my_test:function() {
           alert(' my_test:function()');
           //return sum;
       },
       add:function() {
           sum = sum + 1;
           return sum;
       },
       reset:function() {
           return sum = 0;    
       }  
   }   
}());

function doFunction(route, url)
{
  // .*\/    https://www.w3schools.com/jsref/dom_obj_textarea.asp
  // var myRe = /.*\//;
  // var baseRef = myRe.exec(url)
  // if (baseRef[0] === "https://" || baseRef[0] === "http://") {
  //   baseRef = url;
  // }
  // alert(url + "\n" +baseRef);return;
  
  //var data = "left=right";
  var data = "tagurl="+url;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
    }
  });

  //xhr.open("POST", "http://localhost:3000/ping");
  //xhr.open("POST", "./ping");
  xhr.open("POST", route);
  xhr.setRequestHeader("left", "right");
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("cache-control", "no-cache");
  xhr.setRequestHeader("postman-token", "bf57e600-a698-a505-b14b-b2f0cc01dc81");

  xhr.send(data);
}
