const api = require('mobile-locator');
var longi = [],
  lat = [];
module.exports.getPostion = function(gsm, callback) {
  var gsmStr = gsm.scan1[4];
  if (gsm.scan1[6]) gsmStr = gsm.scan1[6];
  var gsmArr = gsmStr.split(" +CENG:");
  gsmvalue = gsmValues(gsmArr)

  var POSITION = {};
  mcc = gsmvalue.arr1;
  mnc = gsmvalue.arr2;
  lac = gsmvalue.arr3;
  cid = gsmvalue.arr4;
  bsic = gsmvalue.arr4;
  rssi = gsmvalue.arr4;

  towerCoordinates(mcc[0], mnc[0], lac[0], cid[0], (location) => {
    lat.push(location.latitude)
    longi.push(location.longitude)
    console.log(location);
    towerCoordinates(mcc[1], mnc[1], lac[1], cid[1], (location) => {
      lat.push(location.latitude)
      longi.push(location.longitude)
      console.log(location);
      towerCoordinates(mcc[2], mnc[2], lac[2], cid[2], (location) => {
        lat.push(location.latitude)
        longi.push(location.longitude)
        console.log(location);
        towerCoordinates(mcc[3], mnc[3], lac[3], cid[3], (location) => {
          lat.push(location.latitude)
          longi.push(location.longitude)
          console.log(location);
          towerCoordinates(mcc[4], mnc[4], lac[4], cid[4], (location) => {
            lat.push(location.latitude)
            longi.push(location.longitude)
            console.log(location);
            towerCoordinates(mcc[5], mnc[5], lac[5], cid[5], (location) => {
              lat.push(location.latitude)
              longi.push(location.longitude)
              console.log(location);
              towerCoordinates(mcc[6], mnc[6], lac[6], cid[6], (location) => {
                lat.push(location.latitude)
                longi.push(location.longitude)
                console.log(location);
                //  console.log("Lat: " + lat + " Longi: " + longi)
                gsmlocate = locateCalc(lat, longi, rssi, (position) => {
                  POSITION = {};
                  POSITION = position;
                  callback(POSITION);
                  //console.log(position);
                })
              });
            });
          });
        });
      });
    });
  });
}

function gsmValues(gsmArr) {
  //console.log(gsmArr);
  var mcc = [],
    mnc = [],
    lac = [],
    cid = [],
    bsic = [],
    rssi = [];

  for (i = 2; i < 9; i++) {
    gsmArr[i] = gsmArr[i].split(",")
    mcc.push(parseInt((gsmArr[i][1]).replace('\"', '0')))
    if (gsmArr[i][2] == '')
      gsmArr[i][2] = 0
    mnc.push(parseInt(gsmArr[i][2]))
    lac.push(parseInt(gsmArr[i][3], 16))
    cid.push(parseInt(gsmArr[i][4], 16))
    bsic.push(parseInt(gsmArr[i][5]))
    rssi.push(parseInt(gsmArr[i][6]))
  }
  toReturn = {
    arr1: mcc,
    arr2: mnc,
    arr3: lac,
    arr4: cid,
    arr5: bsic,
    arr6: rssi
  };
  //  console.log(JSON.stringify(toReturn));
  return toReturn;
}

function towerCoordinates(mcc, mnc, lac, cid, callback) {
  //  console.log('In tower corrdinates');
  const locate = api('google', {
    key: "AIzaSyCMRlAtDchMFLM2TJmclDYmt--1dqSSsI8"
  });
  locate({
      mcc: mcc,
      mnc: mnc,
      lac: lac,
      cid: cid
    })
    .then(location => {
      callback(location);

    })
    .catch((err) => {
      callback(location = {
        latitude: 0,
        longitude: 0
      })
    })
}


function locateCalc(lat, longi, rssi, callback) {
  var sr = [];
  for (i = 0; i < lat.length; i++) {
    sr[i] = rssi[i] / (rssi[0] + rssi[1] + rssi[2] + rssi[3] + rssi[4] + rssi[5] + rssi[6]);
  }
  longitude = ((longi[0] * sr[0]) + (longi[1] * sr[1]) + (longi[2] * sr[2]) + (longi[3] * sr[3]) + (longi[4] * sr[4]) + (longi[5] * sr[5]) + (longi[6] * sr[6]));
  latitude = ((lat[0] * sr[0]) + (lat[1] * sr[1]) + (lat[2] * sr[2]) + (lat[3] * sr[3]) + (lat[4] * sr[4]) + (lat[5] * sr[5]) + (lat[6] * sr[6]));
  var position = {
    latitude: latitude,
    longitude: longitude
  };

  callback(position);
}
