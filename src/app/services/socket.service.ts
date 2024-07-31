import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Device } from '../types/device.type';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  fromDeviceEvent(): Observable<Device> {
    return this.socket.fromEvent('state.change');
  }
}
