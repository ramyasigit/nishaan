import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AgmCoreModule } from '@agm/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser: any;
  profileBack = "#333333";
  devicesBack = "#78909C";
  trackingBack = "#78909C";
  devConsoleBack = "#78909C";
  indoorBack="#78909C";
  selectedComponent = "profile"
  title = 'app';
  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) {

  }
  ngOnInit() {
    this.refreshCurrentUser();
  }
  onLogoutClick() {
    this.authService.logout();
    this.selectedComponent = "profile"
    this.sidenavColor();
    // this.flashMessage.show('You are logged out', {
    //   cssClass: 'alert-success',
    //   timeout: 3000
    // });
    this.router.navigate(['/']);
    return false;
  }
  sidenavColor() {
    this.profileBack = (this.selectedComponent == "profile") ? "#333333" : "#78909C";
    this.devicesBack = (this.selectedComponent == "devices") ? "#333333" : "#78909C";
    this.trackingBack = (this.selectedComponent == "tracking") ? "#333333" : "#78909C";
    this.devConsoleBack = (this.selectedComponent == "devConsole") ? "#333333" : "#78909C";
    this.indoorBack = (this.selectedComponent == "indoorTracking") ? "#333333" : "#78909C";
  }
  refreshCurrentUser() {
    this.authService.loadToken();
    this.authService.getLoggedUserData().subscribe(data => {
      if (data.success) {
        // this.flashMessage.show('Data retrieved sucessfully', { cssClass: 'alert-success', timeout: 2000 });
        this.authService.storeUserData(this.authService.authToken, data.user);
        this.currentUser = data.user;
      } else {
        // this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 2000 });
      }
    });
  }
}
