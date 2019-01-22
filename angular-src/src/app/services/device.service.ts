import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
@Injectable()
export class DeviceService {

  constructor(private http: Http) { }
  getlatestData(deviceID) {
    let device = {
      deviceID: deviceID
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'devices/getLatest';
    return this.http.post(ep, device, { headers: headers })
      .map(res => res.json());
  }

  getAllOwnedDevices(deviceID) {
    let device = {
      deviceID: deviceID
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'devices/all';
    return this.http.post(ep, device, { headers: headers })
      .map(res => res.json());
  }

  getAllData() {
    let ep = 'devices/all';
    return this.http.get(ep)
      .map(res => res.json());
  }

  getAllBeacons() {
    let ep = 'beacon/all';
    return this.http.get(ep)
      .map(res => res.json());
  }

  getAllGateways() {
    let ep = 'gateway/all';
    return this.http.get(ep)
      .map(res => res.json());
  }

  updateGateway(gateway) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'gateway/update';
    return this.http.put(ep, gateway, { headers: headers })
      .map(res => res.json());
  }
  updateGatewayState(gateway) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'gateway/updateState';
    return this.http.put(ep, gateway, { headers: headers })
      .map(res => res.json());
  }
  updateGatewayCurrentTrack(gateway) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'gateway/updateCurrentTrack';
    return this.http.put(ep, gateway, { headers: headers })
      .map(res => res.json());
  }
  updateGatewayTracks(gateway) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'gateway/updateTracks';
    return this.http.put(ep, gateway, { headers: headers })
      .map(res => res.json());
  }
  addGateway(gateway) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'gateway/add';
    return this.http.post(ep, gateway, { headers: headers })
      .map(res => res.json());
  }
  deleteGateway(gateway) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'gateway/delete';
    return this.http.post(ep, gateway, { headers: headers })
      .map(res => res.json());
  }

  getAllLots() {
    let ep = 'lot/all';
    return this.http.get(ep)
      .map(res => res.json());
  }
  addLot(lot) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'lot/add';
    return this.http.post(ep, lot, { headers: headers })
      .map(res => res.json());
  }

  deleteLot(lot) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'lot/delete';
    return this.http.post(ep, lot, { headers: headers })
      .map(res => res.json());
  }

  updateLot(lot) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'lot/update';
    return this.http.put(ep, lot, { headers: headers })
      .map(res => res.json());
  }

  getDirectons(source, destination) {
    var pos = {
      source: source,
      destination: destination
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'devices/directionPoints';
    return this.http.post(ep, pos, { headers: headers })
      .map(res => res.json());
  }

  getIndoor(room1, room2) {
    var payload = {
      R1: room1,
      R2: room2
    }
    let headers =new Headers();
    headers.append('Content-Type', 'application/json');
    let ep = 'devices/indoor';
    return this.http.post(ep, payload, { headers: headers })
      .map(res => res.json());
  }
}
