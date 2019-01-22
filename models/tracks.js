const mongoose = require('mongoose');
const config = require('../config/database');

// Tracks Schema
const TracksSchema = mongoose.Schema({
  deviceID: {
    type: String,
    required: true
  },
  points: {
    type: Array,
    required: true
  }
});
const Tracks = module.exports = mongoose.model('Tracks', TracksSchema);

module.exports.getTracks = function(callback) {
  Tracks.find(callback);
}
module.exports.getTracksByDevicID = function(track, callback) {
  const query = {
    deviceID: track.deviceID
  };
  Tracks.findOne(query, callback);
}
module.exports.addTrack = (track, callback) => {
  Tracks.create(track, callback);
}
module.exports.deleteTracks = (track, callback) => {
  const query = {
    deviceID: track.deviceID
  };
  Tracks.findOne(query, (err, track) => {
    Tracks.findByIdAndRemove(track._id, callback);
  });
}
module.exports.updateTrack = (track, options, callback) => {
  var query = {
    deviceID: track.deviceID
  };
  var update = {
    points: track.points
  }
  Tracks.findOneAndUpdate(query, update, options, callback);
}
