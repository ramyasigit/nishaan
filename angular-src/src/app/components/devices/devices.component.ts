import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DeviceService } from '../../services/device.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { DevicePipe } from '../../filters/device.pipe';
@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {
  currentUser: any;
  gateways = [];
  selectedValue: String;
  constructor(private authService: AuthService,
    private deviceService: DeviceService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    if (this.authService.user.name) this.currentUser = this.authService.user;
    this.deviceService.getAllGateways().subscribe(data => {
      if (data.success) {
        data.gateways.forEach((gateway) => {
          if (this.currentUser.devices.indexOf(gateway.Id) > -1)
            this.gateways.push({ deviceID: gateway.Id, deviceName: gateway.deviceName, Beacons: gateway.Beacons, noOfBeacons: gateway.Beacons.length });
        });

        // this.flashMessage.show('retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
      }
      // this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 2000 });
    });
  }
}
