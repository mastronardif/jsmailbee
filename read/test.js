var fs = require('fs');
var request = require('request');
global.config = require('../config/default.json');
console.log(`port =${process.env.PORT || 3000}`);

console.log(`STORMPATH_CLIENT_APIKEY_ID =${process.env.STORMPATH_CLIENT_APIKEY_ID || undefined}`);
console.log(global.config);
console.log(global.config.Mg);
//if (){}

return;