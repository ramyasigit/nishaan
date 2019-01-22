import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  showInput = false;
  changePass = false;
  currentPassword: String;
  newPassword: String;
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) {
      this.refreshCurrentUser();
  }
  ngOnInit() {
    this.refreshCurrentUser();
  }
  onAddNewDevice(newDevice) {
    var localDeviceList = [];
    localDeviceList = this.currentUser.devices;
    localDeviceList.push(newDevice);
    var user = {
      username: this.currentUser.username,
      devices: localDeviceList
    };
    this.authService.updateDevices(user).subscribe(data => {
      if (data.success) {

        // this.flashMessage.show('Devices updated sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        this.showInput = false;
        this.refreshCurrentUser();
      } else {

        // this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 2000 });
      }
    });

  }
  onPChangeSubmit() {
    if (!this.currentPassword || !this.newPassword) {

      // this.flashMessage.show("Can't be left blank", {
      //   cssClass: 'alert-warning',
      //   timeout: 1000
      // });
    } else {
      const user = {
        username: this.currentUser.username,
        password: this.currentPassword,
        newPassword: this.newPassword
      };
      this.authService.updatePassword(user).subscribe(data => {
        if (data.success) {
          //
          // this.flashMessage.show(data.msg, {
          //   cssClass: 'alert-success',
          //   timeout: 1000
          // });
          this.authService.logout();

          // this.flashMessage.show('Please Login again', {
          //   cssClass: 'alert-success',
          //   timeout: 3000
          // });
          this.router.navigate(['/']);
        } else {

          // this.flashMessage.show(data.msg, {
          //   cssClass: 'alert-danger',
          //   timeout: 1000
          // });
        }
        this.changePass = false;
      });
      this.currentPassword = "";
      this.newPassword = "";
    }
  }
  refreshCurrentUser() {
    this.authService.loadToken();
    this.authService.getLoggedUserData().subscribe(data => {
      if (data.success) {

        // this.flashMessage.show('Data retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        this.authService.storeUserData(this.authService.authToken, data.user);
        this.currentUser = data.user;
      }
      // this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 2000 });

    });
  }
}
