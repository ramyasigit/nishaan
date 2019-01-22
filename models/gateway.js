const mongoose = require('mongoose');
const config = require('../config/database');

// Gateways Schema
const GatewaysSchema = mongoose.Schema({
  Id: {
    type: String,
    required: true
  },
  Beacons: {
    type: Array,
    default: []
  },
  deviceName: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: "idle"
  },
  currentTrack: {
    type: Array,
    default: []
  },
  tracks: {
    type: Array,
    default: []
  }
});
const Gateways = module.exports = mongoose.model('Gateways', GatewaysSchema);

module.exports.getGateways = function(callback) {
  Gateways.find(callback);
}
module.exports.addGateway = (gateway, callback) => {
  Gateways.create(gateway, callback);
}
module.exports.getGatewaybyName = (name, callback) => {
  const query = {
    deviceName: name
  };
  Gateways.findOne(query, callback);
}

module.exports.getGatewaybyID = (gatewayID, callback) => {
  const query = {
    Id: gatewayID
  };
  Gateways.findOne(query, callback);
}
module.exports.deleteGateways = (gatway, callback) => {
  const query = {
    Id: gatway.Id
  };
  Gateways.findOne(query, (err, gatway) => {
    Gateways.findByIdAndRemove(gatway._id, callback);
  });
}
module.exports.updateGateway = (gateway, options, callback) => {
  var query = {
    Id: gateway.Id
  };
  var update = {
    Beacons: gateway.Beacons,
    deviceName: gateway.deviceName
  }
  Gateways.findOneAndUpdate(query, update, options, callback);
}
module.exports.updateGatewayBeacons = (gateway, options, callback) => {
  var query = {
    Id: gateway.Id
  };
  var update = {
    Beacons: gateway.Beacons
  }
  Gateways.findOneAndUpdate(query, update, options, callback);
}
module.exports.updateGatewayState = (gateway, options, callback) => {
  var query = {
    Id: gateway.Id
  };
  var update = {
    state: gateway.state
  }
  Gateways.findOneAndUpdate(query, update, options, callback);
}
module.exports.updateGatewayTracks = (gateway, options, callback) => {
  var query = {
    Id: gateway.Id
  };
  var update = {
    tracks: gateway.tracks
  }
  Gateways.findOneAndUpdate(query, update, options, callback);
}
module.exports.updateGatewayCurrentTrack = (gateway, options, callback) => {
  var query = {
    Id: gateway.Id
  };
  var update = {
    currentTrack: gateway.currentTrack
  }
  Gateways.findOneAndUpdate(query, update, options, callback);
}
