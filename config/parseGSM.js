var request = require('request');
module.exports.getPostion = function(gsm, callback) {
  var options = {
    url: "http://localhost:8051/gsmLocation",
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      gsm: gsm
    }
  };
  request(options, function(err, res, body) {
    if (err) console.error(err);
    else {
      // console.log(body);
      lat = Number(body.split(",")[0]);
      long = Number(body.split(",")[1]);
      var position = {
        latitude: lat,
        longitude: long
      }
      callback(position)
    }
  });
}
