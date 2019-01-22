import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DevicePipe } from '../../filters/device.pipe';
import { UniqueDevPipe } from '../../filters/unique-dev.pipe';
import { TestIdPipe } from '../../filters/test-id.pipe';
import { GatewayPipe } from '../../filters/gateway.pipe';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-dev-console',
  templateUrl: './dev-console.component.html',
  styleUrls: ['./dev-console.component.css']
})
export class DevConsoleComponent implements OnInit {
  socket;
  S1 = {
    found: 0,
    missed: 0
  };
  S2 = {
    found: 0,
    missed: 0
  };
  S3 = {
    found: 0,
    missed: 0
  };
  AGR = {
    found: 0,
    missed: 0
  };
  allBeacons = [];
  deviceData = [];
  devices = [];
  BEACONS = [];
  LOTS = [];
  GATEWAYS = [];
  allUsers = [];
  allTypes = ["normal", "admin"];
  addGateway = false;
  newGW = "";
  newGWname = "";
  newLot = "";
  delGatewaysNow = false;
  newName = "";
  newUserName = "";
  addUser = false;
  addLot = false;
  delUsersNow = false;
  delLotNow = false;
  currentUser: any;
  constructor(private authService: AuthService,
    private deviceService: DeviceService,
    private flashMessage: FlashMessagesService) {
    this.socket = io();
    this.socket.on("newDevice", (msg) => {
      this.deviceService.getAllData().subscribe(data => {
        this.deviceData = data.devices;
        this.deviceData.sort((device1, device2) => device1.DateTime - device2.DateTime);

        // this.flashMessage.show('Database Updated', { cssClass: 'alert-success', timeout: 1500 });
      });
    });
  }

  ngOnInit() {
    if (this.authService.user.name) this.currentUser = this.authService.user;
    this.authService.getAllUsers().subscribe(data => {
      if (data.success) {
        this.allUsers = data.users;

        // this.flashMessage.show('Users retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
    this.deviceService.getAllData().subscribe(data => {
      if (data.success) {
        this.deviceData = data.devices;
        this.deviceData.sort((device1, device2) => device1.DateTime - device2.DateTime);

        // this.flashMessage.show('Data retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });

    this.deviceService.getAllLots().subscribe(data => {
      if (data.success) {
        this.LOTS = data.lots;

        // this.flashMessage.show('Data retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });


    this.deviceService.getAllBeacons().subscribe(data => {
      if (data.success) {
        data.beacons.forEach((beacon) => {
          this.allBeacons.push(beacon.name);
          this.BEACONS.push(beacon.name);
        });
        this.allBeacons.unshift("-none-");
        this.BEACONS.unshift("-none-");

        // this.flashMessage.show('Beacons retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });

    this.deviceService.getAllGateways().subscribe(data => {
      if (data.success) {

        data.gateways.forEach((gateway) => {
          this.devices.push(gateway);
          this.GATEWAYS.push(gateway.Id);
        });

        // this.flashMessage.show('Gateways retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });

  }

  clearAll() {
    this.S1 = {
      found: 0,
      missed: 0
    };
    this.S2 = {
      found: 0,
      missed: 0
    };
    this.S3 = {
      found: 0,
      missed: 0
    };
    this.AGR = {
      found: 0,
      missed: 0
    };

  }
  ColorScheme(beacon, scan, w) {
    if (Object.keys(scan).some(key => scan[key].name == beacon)) {
      if (w == "ScAn1") this.S1.found = this.S1.found + 1;
      if (w == "ScAn2") this.S2.found = this.S2.found + 1;
      if (w == "ScAn3") this.S3.found = this.S3.found + 1;
      if (w == "Agr") this.AGR.found = this.AGR.found + 1;
      return "#66BB6A";
    } else {
      if (w == "ScAn1") this.S1.missed = this.S1.missed + 1;
      if (w == "ScAn2") this.S2.missed = this.S2.missed + 1;
      if (w == "ScAn3") this.S3.missed = this.S3.missed + 1;
      if (w == "Agr") this.AGR.missed = this.AGR.missed + 1;
      return "#ef5350";
    }
  }
  onAddUserClick() {
    var newUser = {
      name: this.newName,
      username: this.newUserName
    };
    this.authService.addUser(newUser).subscribe(data => {
      if (data.success) {
        this.authService.getAllUsers().subscribe(data => {
          this.allUsers = data.users;
        });

        // this.flashMessage.show('Users added sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }
      // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
      this.newName = "";
      this.newUserName = "";
      this.addUser = false;
      this.delUsersNow = false;
    });
  }

  onUserDelClick(o) {
    var user = {
      username: o.username
    }
    this.authService.deleteUser(user).subscribe(data => {
      if (data.success) {

        // this.flashMessage.show('Deleted sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        this.authService.getAllUsers().subscribe(data => {
          this.allUsers = data.users;
        });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
  }

  onTypeTickClick(o) {
    var user = {
      username: o.username,
      typeOfUser: o.typeSelected
    }
    this.authService.updateType(user).subscribe(data => {
      if (data.success) {
        o.typeOfUser = o.typeSelected;
        o.typeSelected = "";

        // this.flashMessage.show('retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
    o.typeEdit = false;
  }
  onCancClick(o) {
    this.authService.getAllUsers().subscribe(data => {
      this.allUsers = data.users;
    });
  }
  onDeviceEdit(o) {
    o.deviceEdit = true;
    o.allDevices = this.GATEWAYS.filter(item => o.devices.indexOf(item) < 0);
    o.allDevices.unshift("-none-");
    o.deviceSelected = "-none-";
  }

  onLotEdit(o) {
    o.lotEdit = true;
    for (var i = 0; i < o.Beacons; i++)
      o.allBeacons = o.allBeacons.filter(item => o.Beacons.indexOf(item) < 0);
    o.allBeacons = this.BEACONS.filter(item => o.Beacons.indexOf(item) < 0);
    o.beaconSelect = "-none-";
  }
  onLotDelClick(o, d) {
    o.Beacons = o.Beacons.filter(obj => obj !== d);
    o.allBeacons = this.BEACONS.filter(item => o.Beacons.indexOf(item) < 0);
    o.beaconSelect = "-none-";
  }
  onLotPlusClick(o) {
    if (o.beaconSelect != "-none-" && o.beaconSelect != "" && o.beaconSelect != " ") {
      o.Beacons.push(o.beaconSelect);
      o.allBeacons = this.BEACONS.filter(item => o.Beacons.indexOf(item) < 0);
      o.beaconSelect = "-none-";
    }
  }
  onLotTickClick(o) {
    var lot = {
      name: o.name,
      Beacons: o.Beacons
    }
    this.deviceService.updateLot(lot).subscribe(data => {
      if (data.success)
        // this.flashMessage.show('updated sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        this.deviceService.getAllLots().subscribe(data => {
          this.LOTS = data.lots;
        });
    });
    o.lotEdit = false;
  }
  onLotNameDelClick(o) {
    var lot = {
      name: o.name
    }
    this.deviceService.deleteLot(lot).subscribe(data => {
      if (data.success) {

        // this.flashMessage.show('Deleted sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        this.deviceService.getAllLots().subscribe(data => {
          this.LOTS = data.lots;
        });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
  }





  onAddLotClick() {
    this.addLot = false;
    if (this.newLot) {
      var lot = {
        name: this.newLot
      }
      this.deviceService.addLot(lot).subscribe(data => {
        if (data.success) {

          // this.flashMessage.show('Added sucessfully', { cssClass: 'alert-success', timeout: 2000 });
          this.deviceService.getAllLots().subscribe(data => {
            this.LOTS = data.lots;
          });
          this.newLot = "";
        }
        // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
      });
    }
  }





  onDelClick(o, d) {
    o.devices = o.devices.filter(obj => obj !== d);
    o.allDevices = this.GATEWAYS.filter(item => o.devices.indexOf(item) < 0);
    o.allDevices.unshift("-none-");
    o.deviceSelected = "-none-";
  }
  onDevicePlusClick(o) {
    if (o.deviceSelected != "-none-" && o.deviceSelected != "" && o.deviceSelected != " ") {
      o.devices.push(o.deviceSelected);
      o.allDevices = this.GATEWAYS.filter(item => o.devices.indexOf(item) < 0);
      o.allDevices.unshift("-none-");
      o.deviceSelected = "-none-";
    }
  }
  onDeviceTickClick(o) {
    var user = {
      username: o.username,
      devices: o.devices
    }
    this.authService.updateDevices(user).subscribe(data => {
      if (data.success)
        // this.flashMessage.show('updated sucessfully', { cssClass: 'alert-success', timeout: 2000 });

        // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        this.authService.getAllUsers().subscribe(data => {
          this.allUsers = data.users;
        });
    });

    o.deviceEdit = false;
  }




  onBeaconCancClick(o) {
    this.devices = [];
    this.GATEWAYS = [];
    this.deviceService.getAllGateways().subscribe(data => {
      data.gateways.forEach((gateway) => {
        this.devices.push(gateway);
        this.GATEWAYS.push(gateway.Id);
      });
    });
  }
  onBeaconEdit(o) {
    o.beaconEdit = true;
    for (var i = 0; i < this.devices.length; i++)
      this.allBeacons = this.allBeacons.filter(item => this.devices[i].Beacons.indexOf(item) < 0);

    o.beaconSelected = "-none-";
  }
  onBeaconDelClick(o, beacon) {
    o.Beacons = o.Beacons.filter(obj => obj !== beacon);
    for (var i = 0; i < this.devices.length; i++)
      this.allBeacons = this.allBeacons.filter(item => this.devices[i].Beacons.indexOf(item) < 0);
    o.beaconSelected = "-none-";
  }
  onBeaconPlusClick(o) {
    if (o.beaconSelected != "-none-" && o.beaconSelected != "" && o.beaconSelected != " ") {
      o.Beacons.push(o.beaconSelected);
      for (var i = 0; i < this.devices.length; i++)
        this.allBeacons = this.allBeacons.filter(item => this.devices[i].Beacons.indexOf(item) < 0);

      o.beaconSelected = "-none-";
    }
  }
  onBeaconTickClick(o) {
    var gateway = {
      Id: o.Id,
      Beacons: o.Beacons,
      deviceName: o.deviceName
    }
    this.deviceService.updateGateway(gateway).subscribe(data => {
      if (data.success)
        // this.flashMessage.show('updated sucessfully', { cssClass: 'alert-success', timeout: 2000 });

        // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
        this.deviceService.getAllGateways().subscribe(data => {
          this.devices = [];
          this.GATEWAYS = [];
          data.gateways.forEach((gateway) => {
            this.devices.push(gateway);
            this.GATEWAYS.push(gateway.Id);
          });
          this.allBeacons = [];
          this.deviceService.getAllBeacons().subscribe(data => {
            data.beacons.forEach((beacon) => this.allBeacons.push(beacon.name));
            this.allBeacons.unshift("-none-");
            for (var i = 0; i < this.devices.length; i++)
              this.allBeacons = this.allBeacons.filter(item => this.devices[i].Beacons.indexOf(item) < 0);
          });

        });
    });
    o.beaconEdit = false;
  }

  onAddGatewayClick() {
    this.addGateway = false;
    if (this.newGW && this.newGWname) {
      var gateway = {
        Id: this.newGW,
        deviceName: this.newGWname
      }
      this.deviceService.addGateway(gateway).subscribe(data => {
        if (data.success) {

          // this.flashMessage.show('Added sucessfully', { cssClass: 'alert-success', timeout: 2000 });
          this.deviceService.getAllGateways().subscribe(data => {
            this.devices = [];
            this.GATEWAYS = [];
            data.gateways.forEach((gateway) => {
              this.devices.push(gateway);
              this.GATEWAYS.push(gateway.Id);
            });
          });
          this.newGW = "";
          this.newGWname = "";
        } else { }
        // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
      });
    } else { }
    // this.flashMessage.show('No field can be left blank', { cssClass: 'alert-danger', timeout: 2000 });
  }
  onGatewayDelClick(o) {
    var gateway = {
      Id: o.Id
    }
    this.deviceService.deleteGateway(gateway).subscribe(data => {
      if (data.success) {

        // this.flashMessage.show('Deleted sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        this.deviceService.getAllGateways().subscribe(data => {
          this.devices = [];
          this.GATEWAYS = [];
          data.gateways.forEach((gateway) => {
            this.devices.push(gateway);
            this.GATEWAYS.push(gateway.Id);
          });
        });
      } else { }
      // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
  }

}
