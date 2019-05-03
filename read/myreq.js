var request = require('request');

request({
  'url':'https://www.cnbc.com/2019/05/03/nonfarm-payrolls-april-2019.html',
  'method': "GET",
  'proxy':'http://bcpxy.nycnet:8080'
},function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
})
