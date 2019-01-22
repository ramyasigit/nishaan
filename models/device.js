const mongoose = require('mongoose');
const config = require('../config/database');

// Device Schema
const DeviceSchema = mongoose.Schema({
  deviceID: {
    type: String,
    required: true
  },
  dht: {
    Temp: {
      type: Number,
      default: " "
    },
    Humidity: {
      type: Number,
      default: " "
    }
  },
  gps: {
    latitude: {
      type: Number,
      default: " "
    },
    longitude: {
      type: Number,
      default: " "
    }
  },
  Beacons: {
    type: Array,
    default: " "
  },
  noOfBeacons: {
    type: Number,
    default: 0
  },
  DateTime: {
    type: Number,
    default: Date.now
  },
  TestID: {
    type: String,
    default: " "
  },
  ble: {
    type: JSON,
    default: " "
  },
  gsm: {
    latitude: {
      type: Number,
      default: 0
    },
    longitude: {
      type: Number,
      default: 0
    }
  },
  bat: {
    type: Number,
    default: 0
  }

});

const Device = module.exports = mongoose.model('Device', DeviceSchema);

module.exports.getDevices = function(callback) {
  Device.find(callback);
}
module.exports.getAllOwnedDevices = function(deviceIDs, callback) {
  Device.find({
    deviceID: {
      "$in": deviceIDs
    }
  }, callback);

}

// module.exports.getDeviceById = function(id, callback) {
//   Device.findById(id, callback);
// }
module.exports.getDeviceByDeviceID = function(deviceID, callback) {
  const query = {
    deviceID: deviceID
  };
  Device.findOne(query, {}, {
    sort: {
      DateTime: -1
    }
  }, callback);
}
module.exports.getDeviceByTestID = function(TestID, callback) {
  const query = {
    TestID: TestID
  };
  Device.findOne(query, callback);
}
module.exports.addDevice = (device, callback) => {
  Device.create(device, callback);
}
