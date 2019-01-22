var fs = require('fs');
var request = require('request');
// var path = './OLD-DATA/';
// var path = './data/';

var path = './slow/';

//console.log(JSON.parse(fs.readFileSync(path + "1508259288.json")));

var interval = 5 * 1000;

fs.readdir(path, function(err, items) {
  for (i in items) {
    setTimeout(function(i) {
      console.log("Sending: " + items[i]);
      payload = JSON.parse(fs.readFileSync(path + items[i]));
      payload.timeStamp = parseInt(((new Date).getTime()/1000)+19800);
      var options = {
        url: "http://localhost:8080/devices/add",
        // url: "http://34.207.130.57:8066/devices/add",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        json: payload
      };
      request(options, function(err, res, body) {
        if (err) console.error(err);
        else {
          if (body == "200") console.log("sucessfully added");
          else console.log("not added");
        }

      });
    }, interval * i, i);
  }

});
