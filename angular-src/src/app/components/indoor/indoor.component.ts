import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as io from 'socket.io-client';
@Component({
  selector: 'app-indoor',
  templateUrl: './indoor.component.html',
  styleUrls: ['./indoor.component.css']
})
export class IndoorComponent implements OnInit {
  currentUser: any;
  gateways = [];
  startStopColor = "#388E3C"
  STARTSTOP = 'start';
  selectedRoomOne;
  selectedRoomTwo;
  socket;
  indoorData = { GW1: [], GW2: [], CGW3: [] };
  constructor(private authService: AuthService,
    private deviceService: DeviceService,
    private flashMessage: FlashMessagesService) {
    this.socket = io();
    this.socket.on("newDevice", (msg) => {
      if (this.STARTSTOP == 'stop') this.goNow();
    });
  }

  ngOnInit() {
    if (this.authService.user.name) this.currentUser = this.authService.user;
    this.deviceService.getAllGateways().subscribe(data => {
      if (data.success) {
        data.gateways.forEach((gateway) => {
          if (this.currentUser.devices.indexOf(gateway.Id) > -1)
            this.gateways.push({ deviceID: gateway.Id, deviceName: gateway.deviceName, Beacons: gateway.Beacons, noOfBeacons: gateway.Beacons.length });
        });

        // this.flashMessage.show('retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }       // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
  }
  goNow() {
    this.indoorData = { GW1: [], GW2: [], CGW3: [] };
    this.deviceService.getIndoor(this.selectedRoomOne, this.selectedRoomTwo).subscribe(data => {
      this.indoorData = data;
      console.log(this.indoorData);
    })
  }
  startStop() {
    if (this.STARTSTOP == 'stop') {
      this.STARTSTOP = 'start';
      this.startStopColor = "#388E3C";
    } else {
      if (this.selectedRoomOne === this.selectedRoomTwo) {

        // this.flashMessage.show('Same gateways selected ', { cssClass: 'alert-danger', timeout: 2000 });
      } else if (!this.selectedRoomOne || !this.selectedRoomTwo || this.selectedRoomOne == null || this.selectedRoomTwo == null) {

        // this.flashMessage.show('Select gateways', { cssClass: 'alert-danger', timeout: 2000 });
      } else {
        this.STARTSTOP = 'stop';
        this.startStopColor = "#d32f2f";
      }
    }
  }
}
