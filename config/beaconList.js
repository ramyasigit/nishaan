const Beacon = require('../models/beacon');
var request = require('request');
// var array = ["00:A0:50:C5:65:4C", "00:A0:50:C5:65:4A", "00:A0:50:C5:75:B5", "00:A0:50:C5:75:5F", "00:A0:50:C5:75:53", "00:A0:50:C5:65:0E",
//   "00:A0:50:C5:76:95", "00:A0:50:C5:76:91", "00:A0:50:C5:76:86", "00:A0:50:C5:76:9A", "00:A0:50:C5:75:6C", "00:A0:50:C5:75:63", "00:A0:50:C5:75:6A",
//   "00:A0:50:C5:75:6B", "00:A0:50:C5:76:93", "00:A0:50:C5:76:8D", "00:A0:50:C5:65:25", "00:A0:50:C5:75:64", "00:A0:50:C5:65:4D", "00:A0:50:C5:65:1B",
//   "00:A0:50:C5:76:EA", "00:A0:50:C5:65:11", "00:A0:50:C5:75:74", "00:A0:50:C5:76:DE", "00:A0:50:C5:65:1A", "00:A0:50:C5:76:CB", "00:A0:50:C5:75:B4",
//   "00:A0:50:C5:76:94", "00:A0:50:C5:65:17", "00:A0:50:C5:75:65"]
var array = ["00:A0:50:C5:65:25", "00:A0:50:C5:76:8D", "00:A0:50:C5:75:6A", "00:A0:50:C5:75:5F", "00:A0:50:C5:76:91",
  "00:A0:50:C5:75:6B", "00:A0:50:C5:65:1B", "00:A0:50:C5:76:DE","00:A0:50:C5:75:B5","00:A0:50:C5:76:CB"
]
var interval = 0.3 * 1000;
for (var k = 0; k < array.length; k++) {
  setTimeout(function(k) {
    // array.forEach(mac => {
    var payload = {
      mac: array[k],
      name: 'Item-' + (k + 1)
    };

    var options = {
      //url: "http://localhost:8080/beacon/add",
      url: "http://34.207.130.57:8066/beacon/add",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      json: payload
    };
    request(options, function(err, res, body) {
      if (err) console.error(err);
      else {
        if (body.success) console.log("sucessfully added " + body.msg);
        else console.log("not added " + body.msg);
      }
    });
  }, interval * k, k);
}
