const mongoose = require('mongoose');
const config = require('../config/database');

// Lots Schema
const LotsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  Beacons: {
    type: Array,
    default: []
  }
});
const Lots = module.exports = mongoose.model('Lots', LotsSchema);

module.exports.getLots = function(callback) {
  Lots.find(callback);
}
module.exports.addLot = (lot, callback) => {
  Lots.create(lot, callback);
}
module.exports.deleteLots = (lot, callback) => {
  const query = {
    name: lot.name
  };
  Lots.findOne(query, (err, lot) => {
    Lots.findByIdAndRemove(lot._id, callback);
  });
}
module.exports.updateLot = (lot, options, callback) => {
  var query = {
    name: lot.name
  };
  var update = {
    Beacons: lot.Beacons
  }
  Lots.findOneAndUpdate(query, update, options, callback);
}
