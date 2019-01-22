const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const gpsParser = require('../config/parseGPS')
const gsmParser = require('../config/parseGSM');
const Device = require('../models/device');
const Beacon = require('../models/beacon');
const Gateway = require('../models/gateway');
const app = require('../app');
var fs = require('fs');
var request = require('request');
router.get('/all', (req, res) => {
  Device.getDevices((err, devices) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to find devices'
      });
    } else res.json({
      success: true,
      devices: devices
    });
  });
});

router.post('/directionPoints', (req, response) => {
  var source = req.body.source;
  var destination = req.body.destination;
  var ep = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + source.lat + ',' + source.longi + '&destination=' + destination.lat + ',' + destination.longi + '&key=<MAP-API Key>';
  var options = {
    url: ep,
    method: 'GET'
  };
  var directionPoints = [];

  request(options, function(err, res, body) {
    if (err) console.error(err);
    else {
      data = JSON.parse(body);
      data.routes[0].legs[0].steps.forEach((step) => {
        directionPoints.push({
          lat: step.start_location.lat,
          longi: step.start_location.lng
        });
        directionPoints.push({
          lat: step.end_location.lat,
          longi: step.end_location.lng
        });
      });
      response.json({
        directionPoints: directionPoints
      });
    }
  });

});
router.post('/all', (req, res, next) => {
  var deviceID = req.body.deviceID;
  Device.getAllOwnedDevices(deviceID, (err, device) => {
    if (err) console.error(err);
    else {
      if (!device) {
        res.json({
          success: false,
          msg: 'No Device Found'
        });
      } else {
        res.json({
          success: true,
          devices: device
        });
      }
    }
  })
});

// Get the latest data of a given gateway
router.post('/getLatest', (req, res, next) => {
  var deviceID = req.body.deviceID;
  Device.getDeviceByDeviceID(deviceID, (err, device) => {
    if (err) console.error(err);
    else {
      if (!device) {
        res.json({
          success: false,
          msg: 'No Device Found'
        });
      } else {
        res.json({
          success: true,
          Beacons: device.Beacons,
          noOfBeacons: device.noOfBeacons
        });
      }
    }
  })
});
// upload data


router.post('/testGPS', (req, res, next) => {
  parsedData = gpsParser.getPostion(req.body.gps)
  latP1 = parseInt(Number(parsedData.latitude.split(",")[0]) / 100);
  longP1 = parseInt(Number(parsedData.longitude.split(",")[0]) / 100);
  latP2 = (Number(parsedData.latitude.split(",")[0]) - latP1 * 100) / 60;
  longP2 = (Number(parsedData.longitude.split(",")[0]) - longP1 * 100) / 60;
  res.json({
    metaData: {
      raw: parsedData,
      lat1: latP1,
      lat2: latP2,
      long1: longP1,
      long2: longP2
    },
    position: {
      latitude: latP1 + latP2,
      longitude: longP1 + longP2
    }
  });
});






router.post('/add', (req, res, next) => {
  var divName = req.body.devID.substring(12);
  var TestID = divName + "-" + req.body.wakeCounter;
  fs.writeFile("../logs/data/" + TestID + ".json", JSON.stringify(req.body, null, 4), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The " + "./logs/data/" + TestID + ".json file was saved!");
  });
  Device.getDeviceByTestID(TestID, (err, device) => {
    Beacon.getBeacons((err, beacons) => {
      var localBeacons = [];
      beacons.forEach(beacon => {
        localBeacons.push(beacon.mac);
      });
      var latitude = 0;
      var longitude = 0;
      if (!device) {
        if (req.body && req.body != null) {
          if (req.body.gps && req.body.gps != null) {
            if (req.body.gps.length != 0) {
              if ((parsedData = gpsParser.getPostion(req.body.gps[req.body.gps.length - 1].GPRMC))) {
                latP1 = parseInt(Number(parsedData.latitude.split(",")[0]) / 100);
                longP1 = parseInt(Number(parsedData.longitude.split(",")[0]) / 100);
                latP2 = (Number(parsedData.latitude.split(",")[0]) - latP1 * 100) / 60;
                longP2 = (Number(parsedData.longitude.split(",")[0]) - longP1 * 100) / 60;
                var latitude = latP1 + latP2;
                var longitude = longP1 + longP2;
              }
            }
          }
        }

        var SCAN1 = [],
          SCAN2 = [],
          SCAN3 = [];
        var BLEAGR = [];
        var name = "";
        if (req.body.ble) {
          if (req.body.ble.scan2 && req.body.ble.scan2 != null) {
            for (x in req.body.ble.scan2) {

              if (localBeacons.includes(x)) {
                beacons.forEach(beacon => {
                  if (beacon.mac == x) name = beacon.name;
                })
                SCAN2.push({
                  mac: x,
                  name: name,
                  RSSI: Number(req.body.ble.scan2[x])
                })
              }
            }
          }
          if (req.body.ble.scan3 && req.body.ble.scan3 != null) {
            for (x in req.body.ble.scan3) {
              if (localBeacons.includes(x)) {
                beacons.forEach(beacon => {
                  if (beacon.mac == x) name = beacon.name;
                })
                SCAN3.push({
                  mac: x,
                  name: name,
                  RSSI: Number(req.body.ble.scan3[x])
                })
              }
            }
          }
          if (req.body.ble.scan1 && req.body.ble.scan1 != null) {
            for (x in req.body.ble.scan1) {
              if (localBeacons.includes(x)) {
                beacons.forEach(beacon => {
                  if (beacon.mac == x) name = beacon.name;
                })
                SCAN1.push({
                  mac: x,
                  name: name,
                  RSSI: Number(req.body.ble.scan1[x])
                })
              }
            }
          }
          BLEAGR = SCAN1.concat(SCAN2).concat(SCAN3);
          BLEAGR = BLEAGR.unique();

          SCAN1 = [];
          if (req.body.ble.scan1 && req.body.ble.scan1 != null) {
            for (x in req.body.ble.scan1) {
              if (localBeacons.includes(x)) {
                beacons.forEach(beacon => {
                  if (beacon.mac == x) name = beacon.name;
                })
                SCAN1.push({
                  mac: x,
                  name: name,
                  RSSI: Number(req.body.ble.scan1[x])
                })
              }
            }
          }
        }
        var temp = 0,
          humid = 0;
        if (req.body.dht && req.body.dht != null) {
          temp = (req.body.dht.length != 0) ? req.body.dht[req.body.dht.length - 1].split(',')[0] : 0;
          humid = (req.body.dht.length != 0) ? req.body.dht[req.body.dht.length - 1].split(',')[1] : 0;
        }

        var device = {
          deviceID: req.body.devID,
          dht: {
            Temp: temp,
            Humidity: humid
          },
          gps: {
            latitude: latitude,
            longitude: longitude
          },
          bat: (req.body.bat && req.body.bat != null) ? Number(req.body.bat) / 10 : 0,
          Beacons: BLEAGR,
          noOfBeacons: BLEAGR.length,
          DateTime: req.body.timeStamp,
          TestID: TestID,
          ble: {
            SCAN1: SCAN1,
            SCAN2: SCAN2,
            SCAN3: SCAN3
          },
          gsm: {
            latitude: 0,
            longitude: 0
          },
        }

        if (req.body.gsm && req.body.gsm != null) {
          if (req.body.gsm.length != 0) {
            gsmParser.getPostion(req.body.gsm, (POSITION) => {
              if (POSITION && POSITION != null) {
                if (POSITION.latitude && POSITION.latitude != null && POSITION.longitude && POSITION.longitude != null) {
                  device.gsm.latitude = POSITION.latitude;
                  device.gsm.longitude = POSITION.longitude;
                }
              }
              Device.addDevice(device, (err, device) => {
                if (err) {
                  console.log(err);
                  res.send("500");
                } else {
                  res.send("200");
                  console.log('Data Saved with GSM');
                  app.ios("newDevice", "device");
                }
              });
            });
          } else {
            Device.addDevice(device, (err, device) => {
              if (err) {
                console.log(err);
                res.send("500");
              } else {
                console.log('Data Saved gsm length zero');
                res.send("200");
                app.ios("newDevice", "device");
              }
            });
          }
        } else {
          Device.addDevice(device, (err, device) => {
            if (err) {
              console.log(err);
              res.send("500");
            } else {
              res.send("200");
              console.log('Data Saved gsm null');
              app.ios("newDevice", "device");
            }
          });
        }
      } else res.send("200");
    });
  });
});

// res.json({
//   success: true,
//   msg: 'Data uploaded',
//   device: device
// });



router.post('/indoor', (req, res) => {
  var beaconArray1, beaconArray2;
  var mac1 = [],
    mac2 = [],
    rssi1 = [],
    rssi2 = [];
  var gw1 = [],
    gw2 = [],
    confused = [];
  //req.body:{g1:'2002asddasdas',g2:'dasdasdasd'};
  //req.body.g1
  Device.getDeviceByDeviceID(req.body.R1, (err, devices) => { //000000009d38c2c2
    if (err) {
      console.error(err);
    } else {
      if (!devices || devices == null) beaconArray1 = [];
      else {
        beaconArray1 = devices.Beacons;
      }
      // console.log(devices.deviceID);
      // console.log(devices.DateTime);
      //console.log(beaconArray1);
      //console.log("Beacons Scanned :\n", JSON.parse(JSON.stringify(beaconArray1[1]['mac'])),"\n");
      Device.getDeviceByDeviceID(req.body.R2, (err, devices) => { //00000000320cf2df
        if (err) {
          console.error(err);
        } else {
          if (!devices || devices == null) beaconArray2 = [];
          else {
            beaconArray2 = devices.Beacons;
          }
          // console.log(devices.deviceID);
          // console.log(devices.DateTime);
          //  console.log(beaconArray2);
          for (i = 0; i < beaconArray1.length; i++) {
            mac1.push((beaconArray1[i].mac));
            // console.log(mac1);
            rssi1.push(parseInt((beaconArray1[i].RSSI)));
            // console.log(rssi1);
          }
          for (i = 0; i < beaconArray2.length; i++) {
            mac2.push((beaconArray2[i].mac));
            // console.log(mac2);
            rssi2.push(parseInt((beaconArray2[i].RSSI)))
            // console.log(rssi2);
          }
          // console.log("1.st GW");
          // console.log(mac1.length);
          // console.log(rssi1);
          // console.log("2nd GW");
          // console.log(mac2.length);
          var totalMac = mac1.concat(mac2);
          //console.log(rssi2);
        }



        //check for none beaco detection case --directly send response from here
        if (mac1.length == 0 && mac2.length == 0) {
          console.log("None of the beacons were detected");
        }


        if (mac1.length != 0 && mac2.length == 0) {
          for (m = 0; m < mac1.length; m++) {
            gw1.push(mac1[m]);
          }

        }

        if (mac2.length != 0 && mac1.length == 0) {
          for (m = 0; m < mac2.length; m++) {
            gw2.push(mac2[m]);
          }
        }

        if (mac1.length != 0 && mac2.length != 0) {
          // 1st case : check A in B

          for (j = 0; j < beaconArray1.length; j++) { //console.log("j :",j);
            for (k = 0; k < beaconArray2.length; k++) { //console.log("\n",k);
              // mac1 elements are less than mac2 elements
              if (mac2.includes(mac1[j])) { //  console.log("mac from 1 in mac2");
                //mac from mac1 is present in mac2
                if (mac1[j] == mac2[k]) { //mac check start
                  if (rssi1[j] == rssi2[k]) {
                    //console.log(mac1[j],"is a Confusing Beacon");
                    confused.push(mac1[j]);
                  } else if (rssi1[j] > rssi2[k]) {
                    //console.log(mac1[j],"with",rssi1[j]," is attached to Gateway 1 and not Gateway 2 with ",rssi2[k]);
                    gw1.push(mac1[j]);
                  } else
                    //console.log(mac1[j],"with",rssi2[k]," is attached to Gateway 2 and not Gateway 1 with ", rssi1[j]);
                    gw2.push(mac2[k]);
                } //mac check close
              } else {
                //element not in mac2 belongs to gw2
                gw1.push(mac1[j]);
              }

            }
          }

          for (j = 0; j < beaconArray2.length; j++) { //console.log("j :",j);
            for (k = 0; k < beaconArray1.length; k++) { //console.log("\n",k);


              // if mac2 elements are less than mac1 elements

              if (mac1.includes(mac2[j])) {
                if (mac2[j] == mac1[k]) { //mac check start
                  if (rssi2[j] == rssi1[k]) {
                    //console.log(mac1[j],"is a Confusing Beacon");
                    confused.push(mac2[j]);
                  } else if (rssi2[j] > rssi1[k]) {
                    //console.log(mac2[j],"with",rssi2[j]," is attached to Gateway 2 and not Gateway 1 with ",rssi1[k]);
                    gw2.push(mac2[j]);
                  } else {
                    //console.log(mac2[j],"with",rssi1[k]," is attached to Gateway 1 and not Gateway 2 with ", rssi2[j]);
                    gw1.push(mac1[k]);
                  }
                }
              } else {
                //element not in mac1 belongs to gw2
                gw2.push(mac2[j]);
              }
            }
          }
        }

        // console.log("Gateway1",gw1);
        // console.log("Gateway2",gw2);
        // console.log("Confused",confused);

        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }

        var GW1 = gw1.filter(onlyUnique);
        // console.log("Beacons with GW1: ",GW1.length," ",GW1);
        var GW2 = gw2.filter(onlyUnique);
        // console.log("Beacons with GW2",GW2.length," ",GW2);
        var CGW3 = confused.filter(onlyUnique);


        // console.log("Beacons with Confused state ",CGW3.length," ",CGW3);
        // var TotalBeacons = totalMac.filter(onlyUnique);
        // console.log("Total beacons in scenario",TotalBeacons.length);


        Beacon.getBeacons((err, beacons) => {
          var R1Beacons = [],
            R2Beacons = [];
          beacons.forEach(beacon => {
            if (GW1.includes(beacon.mac)) R1Beacons.push(beacon.name);
            if (GW2.includes(beacon.mac)) R2Beacons.push(beacon.name);
          });
          var gateway1 = {
            Id: req.body.R1,
            Beacons: R1Beacons
          }
          var gateway2 = {
            Id: req.body.R2,
            Beacons: R2Beacons
          }

          var track = {
            "GW1": R1Beacons,
            "GW2": R2Beacons
          };
          console.log(track);
          res.json(track);

          Gateway.updateGatewayBeacons(gateway1, {}, (err) => {
            if (err) console.error(err);
          });
          Gateway.updateGatewayBeacons(gateway2, {}, (err) => {
            if (err) console.error(err);
          });
        });
      });
    }

  });

});

module.exports = router;

Array.prototype.unique = function() {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i].mac === a[j].mac) {
        a[i].RSSI = ((a[i].RSSI + a[j].RSSI) / 2);
        a.splice(j--, 1);

      }
    }
  }
  return a;
};


// getDataID = function(wakeCounter) {
//   newRandom = Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000);
//   return newRandom + "" + wakeCounter;
// }
