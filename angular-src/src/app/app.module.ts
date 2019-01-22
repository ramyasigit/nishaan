import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, Routes} from '@angular/router';

import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';

import {FlashMessagesModule} from 'angular2-flash-messages';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

import {AuthService} from './services/auth.service';
import {DeviceService} from "./services/device.service";

import { ProfileComponent } from './components/profile/profile.component';
import { DevicesComponent } from './components/devices/devices.component';
import { DevicePipe } from './filters/device.pipe';
import { ValidLocationsPipe } from './filters/valid-locations.pipe';
import { TrackingComponent } from './components/tracking/tracking.component';
import { DevConsoleComponent } from './components/dev-console/dev-console.component';
import { UniqueDevPipe } from './filters/unique-dev.pipe';
import { TestIdPipe } from './filters/test-id.pipe';
import { GatewayPipe } from './filters/gateway.pipe';
import { ValidGsmPipe } from './filters/valid-gsm.pipe';
import { GtTimeStampPipe } from './filters/gt-time-stamp.pipe';
import { DeviceArrayPipe } from './filters/device-array.pipe';
import { IndoorComponent } from './components/indoor/indoor.component';

const appRoutes: Routes =  [
//    {path:'', component: LoginComponent},
//   //{path:'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
// {path:'dashboard', component: DashboardComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    ProfileComponent,
    DevicesComponent,
    DevicePipe,
    TrackingComponent,
    ValidLocationsPipe,
    DevConsoleComponent,
    UniqueDevPipe,
    TestIdPipe,
    GatewayPipe,
    ValidGsmPipe,
    GtTimeStampPipe,
    DeviceArrayPipe,
    IndoorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    AgmCoreModule.forRoot({
     apiKey: <MAP-API Key>
   }),
   HttpClientModule
  ],
  providers: [AuthService,DeviceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
