import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { DeviceOld } from '../types/device-old.type';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  fromDeviceEvent(): Observable<DeviceOld> {
    return this.socket.fromEvent('state.change');
  }
}
