import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DevicePipe } from '../../filters/device.pipe';
import { DeviceArrayPipe } from '../../filters/device-array.pipe';
import { ValidLocationsPipe } from '../../filters/valid-locations.pipe';
import { ValidGsmPipe } from '../../filters/valid-gsm.pipe';
import { GtTimeStampPipe } from '../../filters/gt-time-stamp.pipe';
import * as io from 'socket.io-client';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
declare var google: any
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  LiveORHistory = "History";
  ShowLiveOrHistory = "Showing Live Data";
  liveOrHistoryColor = "#C5CAE9";
  devicesListForTracking = [];
  currentUser: any;

  selfSelectedGateways = [];

  show1 = "";
  show2 = [];
  show3 = 0;
  show23 = 0;
  deviceData = [];
  realTimeDevices = [[], [], [], []];
  selectedDeviceID = "";
  lat = 18.512246;
  lng = 73.775982;
  socket;
  checkGPS = true;
  checkGSM = false;
  checkPoly = false;
  gateways = [];
  showGateways = [];
  colors = ['#01579B', '#BF360C', '#00695C', '#283593'];
  centrePoint: any;
  myOptions: any;
  map: any;
  directionsService = [];
  directionsDisplay = [];
  markerSource = [];
  markerDestination = [];
  infowindowSource = [];
  infowindowDestination = [];
  IdMarker;
  IdCircle;
  selectedTestID = "";
  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

  constructor(private authService: AuthService,
    private deviceService: DeviceService,
    private flashMessage: FlashMessagesService,
    private http: Http) {
    this.socket = io();
    this.socket.on("newGateway", (msg) => {
      this.deviceService.getAllGateways().subscribe(data => {
        if (data.success) {
          this.gateways = [];
          data.gateways.forEach((gateway) => {
            if (this.currentUser.devices.indexOf(gateway.Id) > -1)
              if (gateway.state == "idle") {
                var displaytext = "Track";
                var BackColor = "#689F38";
              } else {
                var displaytext = "View";
                var BackColor = "#FBC02D";
              }
            var j = this.currentUser.devices.indexOf(gateway.Id);
            var image = "assets/map/gw" + (j + 1) + ".png";
            this.selfSelectedGateways.forEach(selfGateway => {
              if (gateway.Id == selfGateway.deviceID) {
                console.log("device ID " + selfGateway.deviceID + "gateway ID " + gateway.Id);
                displaytext = "Stop";
                BackColor = "#d32f2f";
              }
            });
            // if (this.selfSelectedGateways.includes(gateway)) {
            //
            // }
            this.gateways.push({
              deviceID: gateway.Id, deviceName: gateway.deviceName, Beacons: gateway.Beacons,
              noOfBeacons: gateway.Beacons.length, backColor: BackColor, text: displaytext, state: gateway.state,
              tracks: gateway.tracks, currentTrack: gateway.currentTrack, image: image
            });
          });
          this.deviceData.forEach(device => {
            this.gateways.forEach((gateway) => {
              if (device.deviceID == gateway.deviceID) device.name = gateway.deviceName;
            });
          });
          this.showGateways.forEach(device => {
            this.gateways.forEach((gateway) => {
              if (device.deviceID == gateway.deviceID) device.currentTrack = gateway.currentTrack;
            });
          })

        }
      });
    });
    this.socket.on("newDevice", (msg) => {
      this.deviceService.getAllOwnedDevices(this.currentUser.devices).subscribe(data => {
        this.deviceData = data.devices;
        this.deviceData.sort((device1, device2) => device2.DateTime - device1.DateTime);
        this.deviceService.getAllGateways().subscribe(data => {
          if (data.success) {
            this.gateways = [];
            data.gateways.forEach((gateway) => {
              if (this.currentUser.devices.indexOf(gateway.Id) > -1)
                if (gateway.state == "idle") {
                  var displaytext = "Track";
                  var BackColor = "#689F38";
                } else {
                  var displaytext = "View";
                  var BackColor = "#FBC02D";
                }
              var j = this.currentUser.devices.indexOf(gateway.Id);
              var image = "assets/map/gw" + (j + 1) + ".png";
              this.selfSelectedGateways.forEach(selfGateway => {
                if (gateway.Id == selfGateway.deviceID) {
                  console.log("device ID " + selfGateway.deviceID + "gateway ID " + gateway.Id);
                  displaytext = "Stop";
                  BackColor = "#d32f2f";
                }
              });
              // if (this.selfSelectedGateways.includes(gateway)) {
              //
              // }
              this.gateways.push({
                deviceID: gateway.Id, deviceName: gateway.deviceName, Beacons: gateway.Beacons,
                noOfBeacons: gateway.Beacons.length, backColor: BackColor, text: displaytext, state: gateway.state,
                tracks: gateway.tracks, currentTrack: gateway.currentTrack, image: image
              });
            });
            this.deviceData.forEach(device => {
              this.gateways.forEach((gateway) => {
                if (device.deviceID == gateway.deviceID) device.name = gateway.deviceName;
              });
            });

            this.showGateways.forEach(device => {
              this.gateways.forEach((gateway) => {
                if (device.deviceID == gateway.deviceID) device.currentTrack = gateway.currentTrack;
              });
            })


            if (this.LiveORHistory == "History") {
              var theveryfirst = 0;
              console.log(this.deviceData[0]);
              var rtDevice = this.deviceData[0];
              for (var k = 0; k < this.showGateways.length; k++) if (rtDevice.deviceID == this.showGateways[k].deviceID) this.realTimeDevices[k].push(rtDevice);
              console.log(this.realTimeDevices);

              for (var a = 0; a < this.realTimeDevices.length; a++) {
                var firstFlag = 1, last = 0, first = 0;
                var waypt = [];
                var source, destination;
                for (var b = 0; b < this.realTimeDevices[a].length; b++) {
                  console.log("in the for loop -> a is " + a + " b is " + b);
                  if (this.realTimeDevices[a][b].gps.latitude != 0 && this.realTimeDevices[a][b].gps.longitude != 0) {
                    console.log('nonzero GPS');
                    var point = new google.maps.LatLng(this.realTimeDevices[a][b].gps.latitude, this.realTimeDevices[a][b].gps.longitude);
                    if (firstFlag == 1) {
                      var lat = this.realTimeDevices[a][b].gps.latitude;
                      var longi = this.realTimeDevices[a][b].gps.longitude;
                      source = point;
                      theveryfirst = theveryfirst + 1;
                      if (theveryfirst == 1) this.map.setCenter(point);
                      first = b;
                    } else if ((this.realTimeDevices[a][b].gps.latitude >= lat + 0.0000009 || this.realTimeDevices[a][b].gps.latitude <= lat - 0.0000009) &&
                      (this.realTimeDevices[a][b].gps.longitude >= longi + 0.0000009 || this.realTimeDevices[a][b].gps.longitude <= longi - 0.0000009)) {
                      waypt.push({
                        location: point,
                        stopover: false
                      });
                    }
                    last = b;
                    firstFlag = 0;
                    lat = this.realTimeDevices[a][b].gps.latitude;
                    longi = this.realTimeDevices[a][b].gps.longitude;
                  } else if (this.realTimeDevices[a][b].gps.latitude != 0 && this.realTimeDevices[a][b].gps.longitude != 0) {
                    console.log('nonzero GSM');
                    var point = new google.maps.LatLng(this.realTimeDevices[a][b].gsm.latitude, this.realTimeDevices[a][b].gsm.longitude);
                    if (firstFlag == 1) {
                      var lat = this.realTimeDevices[a][b].gsm.latitude;
                      var longi = this.realTimeDevices[a][b].gsm.longitude;
                      source = point;
                      first = b;
                    } else if ((this.realTimeDevices[a][b].gsm.latitude >= lat + 0.0000009 || this.realTimeDevices[a][b].gsm.latitude <= lat - 0.0000009) &&
                      (this.realTimeDevices[a][b].gsm.longitude >= longi + 0.0000009 || this.realTimeDevices[a][b].gsm.longitude <= longi - 0.0000009)) {
                      waypt.push({
                        location: point,
                        stopover: false
                      });
                    }
                    last = b;
                    firstFlag = 0;
                    lat = this.realTimeDevices[a][b].gsm.latitude;
                    longi = this.realTimeDevices[a][b].gsm.longitude;
                  }

                  destination = new google.maps.LatLng(this.realTimeDevices[a][last].gps.latitude, this.realTimeDevices[a][last].gps.longitude);
                  var currentGateway = {
                    Id: this.realTimeDevices[a][first].deviceID,
                    currentTrack: {
                      BleAgrStart: this.realTimeDevices[a][first].Beacons,
                      BleAgrStop: this.realTimeDevices[a][last].Beacons,
                      startPoint: this.realTimeDevices[a][first].TestID,
                      stopPoint: this.realTimeDevices[a][last].TestID,
                      startTime: this.realTimeDevices[a][first].DateTime,
                      stopTime: this.realTimeDevices[a][last].DateTime,
                      source: source,
                      destination: destination,
                      waypts: waypt
                    }
                  }

                  var contentFirst = "";
                  contentFirst = '<h4>' + this.realTimeDevices[a][first].deviceID + '</h4> <p>';
                  this.realTimeDevices[a][first].Beacons.forEach(beacon => {
                    contentFirst = contentFirst + beacon.name + '<br>';
                  })
                  contentFirst = contentFirst + '</p>';

                  var contentLast = "";
                  contentLast = '<h4>' + this.realTimeDevices[a][last].deviceID + '</h4> <p>';
                  this.realTimeDevices[a][last].Beacons.forEach(beacon => {
                    contentLast = contentLast + beacon.name + '<br>';
                  })
                  contentLast = contentLast + '</p>';

                  var metaData = {
                    first: contentFirst,
                    last: contentLast
                  }
                  var DEVID = this.realTimeDevices[a][last].deviceID;
                }
                if (this.realTimeDevices[a].length != 0) {
                  console.log('a is ' + a);
                  this.calculateAndDisplayRoute(this.directionsService[a], this.directionsDisplay[a], source, destination, waypt, metaData, a);
                  data.gateways.forEach((gateway) => {
                    if (gateway.deviceID == DEVID) {
                      var j = this.currentUser.devices.indexOf(gateway.deviceID);
                      gateway.image = "assets/map/gw" + (j + 1) + ".png";
                    }
                  });
                  this.deviceService.updateGatewayCurrentTrack(currentGateway).subscribe(data => {
                    console.log('data Saved')
                  });
                }
              }
            }

            //this.flashMessage.show('retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });

          } else { } //this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        });
        //
        //this.flashMessage.show('Database Updated', { cssClass: 'alert-success', timeout: 1500 });
      });


    });
  }

  onGatewayButtonCLick(gateway) {
    this.gateways.forEach((device) => {
      if (gateway.deviceID == device.deviceID) gateway.currentTrack = device.currentTrack;
    });
    if (gateway.state == "idle") {
      if (gateway.text == "Track") {
        gateway.text = "Stop";
        gateway.backColor = "#d32f2f";
        this.selfSelectedGateways.push(gateway);
        this.showGateways.push(gateway);
        var gat = {
          Id: gateway.deviceID,
          state: 'busy'
        }
        this.deviceService.updateGatewayState(gat).subscribe(data => {
        });
      }
    } else {
      if (gateway.text == 'View') {
        var index = -1;
        for (var k = 0; k < this.showGateways.length; k++) {
          if (gateway.deviceID == this.showGateways[k].deviceID) {
            index = k;
          }
        }
        if (index > -1) {
          this.showGateways.splice(index, 1);
        } else {
          this.showGateways.push(gateway);
        }
      } else {
        var index = -1;
        for (var k = 0; k < this.selfSelectedGateways.length; k++) {
          if (gateway.deviceID == this.selfSelectedGateways[k].deviceID) {
            index = k;
          }
        }
        if (index > -1) {
          gateway.text = "Track";
          gateway.backColor = "#689F38";
          this.selfSelectedGateways.splice(index, 1);
          var gat = {
            Id: gateway.deviceID,
            state: 'idle'
          }
          this.deviceService.updateGatewayState(gat).subscribe(data => {
          });
          var tracks = gateway.tracks;
          console.log(gateway.currentTrack)
          if (gateway.currentTrack[0] != null) tracks.push(gateway.currentTrack[0])
          var gat1 = {
            Id: gateway.deviceID,
            tracks: tracks
          }
          this.deviceService.updateGatewayTracks(gat1).subscribe(data => {
          });
          var currentGateway = {
            Id: gateway.deviceID,
            currentTrack: {
            }
          }
          this.deviceService.updateGatewayCurrentTrack(currentGateway).subscribe(data => {
            console.log('data Saved')
          });
        }
        var index = -1;
        for (var k = 0; k < this.showGateways.length; k++) {
          if (gateway.deviceID == this.showGateways[k].deviceID) {
            index = k;
          }
        }
        if (index > -1) {
          this.showGateways.splice(index, 1);

        }

      }
    }
  }

  clear() {
    this.ShowLiveOrHistory = "Showing Live Data";
    this.liveOrHistoryColor = "#C5CAE9";
    this.LiveORHistory = "History";
    this.showGateways = [];
    this.selfSelectedGateways = [];
    this.devicesListForTracking = [];
    this.selectedDeviceID = "";
    this.selectedTestID = "";
    this.initMap();
    for (var k = 0; k < this.gateways.length; k++) this.gateways[k].value = false;
  }
  liveOrHistory() {
    if (this.LiveORHistory == "History") {
      this.ShowLiveOrHistory = "Showing Historical Data  ==< Select track to show from the devices Tab >==";
      this.liveOrHistoryColor = "#B2EBF2";
      this.LiveORHistory = "Live";
    } else {
      this.ShowLiveOrHistory = "Showing Live Data";
      this.liveOrHistoryColor = "#C5CAE9";
      this.LiveORHistory = "History";
      this.initMap();
    }
  }
  containsObject(deviceID, list) {
    var name = "";
    this.gateways.forEach((gateway) => {
      if (gateway.deviceID == deviceID) name = gateway.deviceName;
    });
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] == name) {
        return true;
      }
    }

    return false;
  }
  goNow() {
    for (var k = 0; k < this.gateways.length; k++) {
      var index = this.selfSelectedGateways.indexOf(this.gateways[k]);
      if (index > -1) {
        this.selfSelectedGateways.splice(index, 1);
        this.showGateways.splice(index, 1)
      } else {
        this.selfSelectedGateways.push(this.gateways[k]);
        this.showGateways.push(this.gateways[k]);
      }
    }
  }
  onCheckBoxCLick(deviceName) {
    var index = this.devicesListForTracking.indexOf(deviceName)
    if (index > -1) {
      this.devicesListForTracking.splice(index, 1);
      console.log(this.devicesListForTracking)
    } else {
      this.devicesListForTracking.push(deviceName);
      console.log(this.devicesListForTracking)
    }
  }
  ngOnInit() {

    // this.selfSelectedGateways = [];
    if (this.authService.user.name) this.currentUser = this.authService.user;
    this.deviceService.getAllOwnedDevices(this.currentUser.devices).subscribe(data => {

      if (data.success) {
        this.gateways = [];
        this.deviceData = data.devices;
        this.deviceData.sort((device1, device2) => device2.DateTime - device1.DateTime);
        this.deviceService.getAllGateways().subscribe(data => {
          if (data.success) {
            data.gateways.forEach((gateway) => {
              if (this.currentUser.devices.indexOf(gateway.Id) > -1)
                if (gateway.state == "idle") {
                  var displaytext = "Track";
                  var BackColor = "#689F38";
                } else {
                  var displaytext = "View";
                  var BackColor = "#FBC02D";
                }
              var j = this.currentUser.devices.indexOf(gateway.Id);

              var image = "assets/map/gw" + (j + 1) + ".png";
              this.selfSelectedGateways.forEach(selfGateway => {
                if (gateway.Id == selfGateway.deviceID) {
                  console.log("device ID " + selfGateway.deviceID + " gateway ID " + gateway.Id);
                  displaytext = "Stop";
                  BackColor = "#d32f2f";
                }
              });
              this.gateways.push({
                deviceID: gateway.Id, deviceName: gateway.deviceName, Beacons: gateway.Beacons,
                noOfBeacons: gateway.Beacons.length, backColor: BackColor, text: displaytext, state: gateway.state,
                tracks: gateway.tracks, currentTrack: gateway.currentTrack, image: image
              });
            });
            this.deviceData.forEach(device => {
              this.gateways.forEach((gateway) => {
                if (device.deviceID == gateway.deviceID) device.name = gateway.deviceName;
              });
            });
            // this.showGateways = this.gateways;

            //this.flashMessage.show('retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
          } else { }
          //this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        });

        //this.flashMessage.show('retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      } else { }
      //this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
    this.initMap();
  }
  initMap() {
    this.centrePoint = new google.maps.LatLng(18.511689999999998, 73.77499833333333);
    var pointB = new google.maps.LatLng(18.511689999999998, 73.77499833333333);
    this.myOptions = {
      zoom: 15,
      center: this.centrePoint
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'), this.myOptions);
    // Instantiate a directions service.

    for (var alpha = 0; alpha < 5; alpha++) {
      this.directionsService[alpha] = new google.maps.DirectionsService;
      this.directionsDisplay[alpha] = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: this.colors[alpha],
          strokeWeight: 5,
          strokeOpacity: 0.5
        }
      });
      var homeimage = {
        url: "assets/map/source.png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(100, 50),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 10),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(30, 40)
      };
      this.markerSource[alpha] = new google.maps.Marker({
        title: "Source",
        label: "S",
        map: this.map,
        icon: "assets/map/source.png",
        animation: google.maps.Animation.DROP
      });
      var image = {
        url: "assets/map/gw" + (alpha + 1) + ".png",
        // This marker is 20 pixels wide by 32 pixels high.
        size: new google.maps.Size(100, 50),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 10),
        // The anchor for this image is the base of the flagpole at (0, 32).
        anchor: new google.maps.Point(30, 40)
      };
      this.markerDestination[alpha] = new google.maps.Marker({
        title: "Destination",
        label: "D",
        icon: image,
        map: this.map,
        animation: google.maps.Animation.DROP,
      });
      this.infowindowSource[alpha] = new google.maps.InfoWindow();
      this.infowindowDestination[alpha] = new google.maps.InfoWindow();
    }
    var pointX = new google.maps.LatLng(18.511689995999998, 73.77499033333333);
    var pointY = new google.maps.LatLng(18.512689999999998, 73.79499843333333);
    this.IdMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    this.IdCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      radius: 500
    });

  }

  // gettingDirections() {
  //   if (!this.checkPoly) {
  //     this.checkPoly = true;
  //     var DEVICES = this.deviceData;
  //     DEVICES.sort((device1, device2) => device1.DateTime - device2.DateTime);
  //     // var infowindow = new google.maps.InfoWindow();
  //     console.log(this.currentUser.devices);
  //     console.log(this.devicesListForTracking);
  //     for (var j = 0; j < this.currentUser.devices.length; j++) {
  //       var source, destination;
  //       var waypt = [];
  //       var flag1st = 1;
  //       var last = 0;
  //       var first = 0;
  //
  //       //  for (var j in this.currentUser.devices) {
  //       for (var i = 0; i < DEVICES.length; i++) {
  //         if (DEVICES[i].gps.latitude != 0 && DEVICES[i + 1].gps.latitude != 0 && DEVICES[i].SourceTime != ""
  //           && DEVICES[i].DestinationTime != "") {
  //           if (DEVICES[i].deviceID == this.currentUser.devices[j] && DEVICES[i].TestID >= DEVICES[i].SourceTime &&
  //             DEVICES[i].TestID <= DEVICES[i].DestinationTime) {
  //             var point = new google.maps.LatLng(DEVICES[i].gps.latitude, DEVICES[i].gps.longitude);
  //             if (flag1st == 1) {
  //               first = i;
  //               source = point;
  //               var lat = DEVICES[i].gps.latitude;
  //               var longi = DEVICES[i].gps.longitude;
  //             }
  //             if (flag1st != 1 && (DEVICES[i].gps.latitude >= lat + 0.0000009 || DEVICES[i].gps.latitude <= lat - 0.0000009) &&
  //               (DEVICES[i].gps.longitude >= longi + 0.0000009 || DEVICES[i].gps.longitude <= longi - 0.0000009)) {
  //               waypt.push({
  //                 location: point,
  //                 stopover: false
  //               });
  //               // var marker = new google.maps.Marker({
  //               //   position: point,
  //               //   title: "" + DEVICES[i].testId,
  //               //   label: "" + index,
  //               //   map: this.map,
  //               //   animation: google.maps.Animation.DROP,
  //               //   imp: content
  //               // });
  //               //
  //               // google.maps.event.addListener(marker, 'click', (function(marker, i) {
  //               // return function() {
  //               //     infowindow.setContent(marker.imp);
  //               //     infowindow.open(this.map, marker);
  //               //   }
  //               // })(marker, i));
  //             }
  //             lat = DEVICES[i].gps.latitude;
  //             longi = DEVICES[i].gps.longitude;
  //             last = i;
  //             flag1st = 0;
  //           }
  //         }
  //       }
  //       var contentFirst = "";
  //       contentFirst = '<h4> Beacons </h4> <p>';
  //       var list = [];
  //       DEVICES[first].Beacons.forEach(beacon => {
  //         list.push(beacon.mac);
  //         contentFirst = contentFirst + beacon.mac + '<br>';
  //       })
  //       contentFirst = contentFirst + '</p>';
  //
  //       var contentLast = "";
  //       contentLast = '<h4> Beacons </h4> <p>';
  //       var list = [];
  //       DEVICES[last].Beacons.forEach(beacon => {
  //         list.push(beacon.mac);
  //         contentLast = contentLast + beacon.mac + '<br>';
  //       })
  //       contentLast = contentLast + '</p>';
  //
  //       var metaData = {
  //         first: contentFirst,
  //         last: contentLast
  //       }
  //       // var directionsService = new google.maps.DirectionsService;
  //       // var directionsDisplay = new google.maps.DirectionsRenderer({
  //       //   map: this.map,
  //       //   suppressMarkers: true,
  //       //   polylineOptions: {
  //       //     strokeColor: this.colors[j - 1],
  //       //     strokeWeight: 4,
  //       //     strokeOpacity: 0.3
  //       //   }
  //       // });
  //       destination = new google.maps.LatLng(DEVICES[last].gps.latitude, DEVICES[last].gps.longitude);
  //       if (this.containsObject(this.currentUser.devices[j], this.devicesListForTracking)) {
  //         waypt.pop();
  //         this.calculateAndDisplayRoute(this.directionsService[j], this.directionsDisplay[j], source, destination, waypt, metaData, j);
  //       }
  //     }
  //   }
  // }



  gettingDirections(gateway) {
    console.log(gateway)
    //we have selectedTrack in gateway
    var DEVICES = this.deviceData;

    var source = gateway.selectedTrack.source;
    var destination = gateway.selectedTrack.destination;
    var waypt = gateway.selectedTrack.waypts;
    var j = this.currentUser.devices.indexOf(gateway.deviceID);

    var contentFirst = "";
    contentFirst = '<h4>' + gateway.deviceName + '</h4> <p>';

    gateway.selectedTrack.BleAgrStart.forEach(beacon => {
      contentFirst = contentFirst + beacon.name + '<br>';
    })
    contentFirst = contentFirst + '</p>';

    var contentLast = "";
    contentLast = '<h4>' + gateway.deviceName + '</h4> <p>';
    gateway.selectedTrack.BleAgrStart.forEach(beacon => {
      contentLast = contentLast + beacon.name + '<br>';
    })
    contentLast = contentLast + '</p>';

    var metaData = {
      first: contentFirst,
      last: contentLast
    }
    this.calculateAndDisplayRoute(this.directionsService[j], this.directionsDisplay[j], source, destination, waypt, metaData, j);
  }



  calculateAndDisplayRoute(directionsService, directionsDisplay, pointSource, pointDestination, waypts, meta, position) {
    var infowindowSource = new google.maps.InfoWindow();
    var infowindowDestination = new google.maps.InfoWindow();
    // this.infowindowSource[position].setContent(meta.first);
    // this.infowindowDestination[position].setContent(meta.last);
    // //console.log(position)
    this.markerSource[position].setPosition(pointSource);
    this.markerDestination[position].setPosition(pointDestination);
    google.maps.event.clearInstanceListeners(this.markerSource[position]);
    google.maps.event.clearInstanceListeners(this.markerDestination[position]);
    google.maps.event.addListener(this.markerSource[position], 'click', function() {
      infowindowSource.setContent(meta.first);
      infowindowSource.open(this.map, this);
    });
    // google.maps.event.addListener(this.markerSource[position], 'mouseover', (function(marker, position) {
    //   return function() {
    //     infowindowSource.close();
    //   }
    // })(this.markerSource[position], position));
    // if(waypts.length>1){
    this.map.setCenter(pointDestination);
    this.map.setZoom(12);

    //   if(waypts.length%2==0) this.map.setCenter(waypts[waypts.length/2].location);
    //   else this.map.setCenter(waypts[waypts.length+1/2].location);
    // }else
    google.maps.event.addListener(this.markerDestination[position], 'click', (function(marker, position) {
      return function() {
        infowindowDestination.setMap(null);
        infowindowDestination.setContent(meta.last);
        infowindowDestination.open(this.map, marker);
      }
    })(this.markerDestination[position], position));
    //
    // google.maps.event.addListener(this.markerDestination[position], 'mouseover', (function(marker, position) {
    //   return function() {
    //     infowindowDestination.close();
    //   }
    // })(this.markerDestination[position], position));
    // this.markerSource[position].addListener('click', function() {
    //   this.infowindowSource[position].open(this.map, this.markerSource[position]);
    //   infowindowSource.open(this.map, this.markerSource[position]);
    //   console.log('position ' + position + " and device is" + this.currentUser.devices[position]);
    // });
    //
    // this.markerDestination[position].addListener('click', function() {
    //   this.infowindowDestination[position].open(this.map, this.markerDestination[position]);
    //   infowindowDestination.open(this.map, this.markerDestination[position]);
    // });
    // this.initMap();
    directionsService.route({
      origin: pointSource,
      destination: pointDestination,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        //window.alert('Directions request failed due to ' + status);
      }
    });
  }
  loadMarkersandCircles() {
    var DEVICES = this.deviceData;
    for (var i in DEVICES) {
      if (this.checkGPS && DEVICES[i].gps.latitude != 0 && DEVICES[i].gps.longitude != 0 && DEVICES[i].TestID == this.selectedTestID) {
        var point = new google.maps.LatLng(DEVICES[i].gps.latitude, DEVICES[i].gps.longitude);
        this.IdMarker.setMap(this.map);
        this.IdMarker.setPosition(point);
        var contentForHere = "";
        DEVICES[i].Beacons.forEach(beacon => {
          contentForHere = contentForHere + beacon.mac + ' ';
        })
        this.IdMarker.setTitle(contentForHere);

      }
      if (this.checkGSM && DEVICES[i].gsm.latitude != 0 && DEVICES[i].gsm.longitude != 0 && DEVICES[i].TestID == this.selectedTestID) {
        var pointG = new google.maps.LatLng(DEVICES[i].gsm.latitude, DEVICES[i].gsm.longitude);
        this.IdCircle.setMap(this.map);
        this.IdCircle.setCenter(pointG);
      }
      if (!this.checkGPS) this.IdMarker.setMap(null);
      if (!this.checkGSM) this.IdCircle.setMap(null);
    }
  }

  setSRCDSTTime(gateway) {

  }
  // gettingDirections() {
  //   if (!this.checkPoly) {
  //     this.directionPoints = [];
  //     var DEVICES = this.deviceData;
  //     for (var i = 0; i < DEVICES.length - 2; i++) {
  //       this.show2.push(DEVICES[i].TestID);
  //       if (DEVICES[i].gps.latitude != 0 && DEVICES[i].deviceID == this.selectedDeviceID && DEVICES[i + 1].gps.latitude != 0 && DEVICES[i + 1].deviceID == this.selectedDeviceID) {
  //         this.show3 = this.show3 + 1;
  //         var source = {
  //           lat: DEVICES[i].gps.latitude,
  //           longi: DEVICES[i].gps.longitude
  //         };
  //         var destination = {
  //           lat: DEVICES[i + 1].gps.latitude,
  //           longi: DEVICES[i + 1].gps.longitude
  //         }
  //         this.getLocationPoints(source, destination).subscribe(data => {
  //           console.log(data);
  //           data.routes[0].legs[0].steps.forEach((step) => {
  //             this.directionPoints.push({
  //               lat: step.start_location.lat,
  //               longi: step.start_location.lng
  //             });
  //             this.directionPoints.push({
  //               lat: step.end_location.lat,
  //               longi: step.end_location.lng
  //             });
  //           });
  //         },
  //           err => console.log());
  //       } else console.log('Error')
  //     }
  //     for (var al = 0; al < this.directionPoints.length; ++al) {
  //       for (var bl = al + 1; bl < this.directionPoints.length; ++bl) {
  //         if (this.directionPoints[al].lat == this.directionPoints[bl].lat) this.directionPoints.splice(bl--, 1);
  //       }
  //     }
  //     console.log(this.directionPoints);
  //     this.checkPoly = true;
  //   } else this.checkPoly = false;
  // }
  //
  // getLocationPoints(source, destination) {
  //
  //   let ep = 'https://maps.googleapis.com/maps/api/directions/json?origin=' + source.lat + ',' + source.longi + '&destination=' + destination.lat + ',' + destination.longi + '&key=<MAP-API Key>';
  //   //let ep = encodeURI(ap);
  //   console.log()
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/jsonp');
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   // let ep = 'http://localhost:8080/devices/all';
  //   return this.http.get(ep, { headers: headers })
  //     .map(response => response.json());
  // }

  // gettingDirections() {
  //   if (!this.checkPoly) {
  //     this.directionPoints = [];
  //     var DEVICES = this.deviceData;
  //     var interval = 0.5 * 1000;
  //     var i = 0;
  //     for (i = 0; i < 30; i++) {
  //       setTimeout(i => {
  //         this.show2.push(DEVICES[i].TestID);
  //         if (DEVICES[i].gps.latitude != 0 && DEVICES[i].deviceID == this.selectedDeviceID && DEVICES[i + 1].gps.latitude != 0 && DEVICES[i + 1].deviceID == this.selectedDeviceID) {
  //           this.show3 = this.show3 + 1;
  //           var source = {
  //             lat: DEVICES[i].gps.latitude,
  //             longi: DEVICES[i].gps.longitude
  //           };
  //           var destination = {
  //             lat: DEVICES[i + 1].gps.latitude,
  //             longi: DEVICES[i + 1].gps.longitude
  //           }
  //           // this.directionPoints.push(source);
  //           this.deviceService.getDirectons(source, destination).subscribe(data => {
  //             data.directionPoints.forEach(d => {
  //               this.directionPoints.push(d);
  //             })
  //             //   this.directionPoints.push(destination);
  //
  //             // for (var al = 0; al < this.directionPoints.length; ++al) {
  //             //   for (var bl = al + 1; bl < this.directionPoints.length; ++bl) {
  //             //     if (this.directionPoints[al].lat == this.directionPoints[bl].lat) this.directionPoints.splice(bl--, 1);
  //             //   }
  //             // }
  //           });
  //         }
  //       }, interval * i, i);
  //     }
  //     // console.log(this.directionPoints);
  //     this.checkPoly = true;
  //   } else this.checkPoly = false;
  // }


}
