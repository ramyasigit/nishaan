const mongoose = require('mongoose');
const config = require('../config/database');

// Beacons Schema
const BeaconsSchema = mongoose.Schema({
  mac: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});
const Beacons = module.exports = mongoose.model('Beacons', BeaconsSchema);

module.exports.getBeacons = function(callback) {
  Beacons.find(callback);
}
module.exports.addBeacon = (beacon, callback) => {
  Beacons.create(beacon, callback);
}
module.exports.deleteBeacons = (beacon, callback) => {
  const query = {
    mac: beacon.mac
  };
  Beacons.findOne(query, (err, beacon) => {
    Beacons.findByIdAndRemove(beacon._id, callback);
  });
}
module.exports.updateBeacon = (beacon, options, callback) => {
  var query = {
    mac: beacon.mac
  };
  var update = {
    name: beacon.name
  }
  Beacons.findOneAndUpdate(query, update, options, callback);
}
