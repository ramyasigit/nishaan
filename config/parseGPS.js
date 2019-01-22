const nmea = require('node-nmea')
module.exports.getPostion = function(gprmc) {
  var data = nmea.parse(gprmc);
  if (data.valid) {
    return position = {
      latitude: data.loc.dmm.latitude,
      longitude: data.loc.dmm.longitude
    }
  } else {
    return false;
  }
}
