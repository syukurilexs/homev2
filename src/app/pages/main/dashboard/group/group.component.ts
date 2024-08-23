import { Component, OnDestroy } from '@angular/core';
import { GroupService } from '../../../../services/group.service';
import {
  BehaviorSubject,
  debounceTime,
  first,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Group } from '../../../../types/group.type';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeviceE } from '../../../../enums/device-type.enum';
import { StateE } from '../../../../enums/state.enum';
import { DeviceService } from '../../../../services/device.service';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { registerIcon } from '../../../../functions/register-icon.func';
import { MatFabButton } from '@angular/material/button';
import { SocketService } from '../../../../services/socket.service';
import { Device } from '../../../../types/device.type';
import { DeviceLight } from '../../../../types/device-light.type';
import { DeviceFan } from '../../../../types/device-fan.type';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFabButton,
    NgClass,
    MatIcon,
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent implements OnDestroy {
  isHandset$!: Observable<boolean>;
  groups$!: Observable<Group[]>;
  destroyed = new Subject<void>();
  refreshGroup$ = new Subject<void>();

  groups: Group[] = [];

  constructor(
    private groupService: GroupService,
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private socketService: SocketService,
  ) {
    this.initObservable();
    this.listenToDeviceChange();
    this.loadGroups();

    // register svg icon
    registerIcon(['fan', 'light'], sanitizer, iconRegistry);
  }

  loadGroups() {
    this.groupService
      .getAll()
      .pipe(first())
      .subscribe((x) => {
        this.groups = x;
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  listenToDeviceChange() {
    this.socketService
      .fromDeviceEvent()
      .pipe(debounceTime(300), takeUntil(this.destroyed))
      .subscribe((x) => {
        this.loadGroups();
      });
  }

  initObservable() {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
      takeUntil(this.destroyed),
    );
  }

  onClicked(group: Group, device: Device) {
    if (device.type === DeviceE.Light) {
      const light = device as DeviceLight;
      const state = light.light.state === StateE.Off ? StateE.On : StateE.Off;

      // Update state on client. This process to avoid delay view on client while
      // waiting response from server
      this.groups.map((x) => {
        x.devices.map((y) => {
          if (y.id === device.id) {
            if (y.type === DeviceE.Light) {
              (y as DeviceLight).light.state = state;
            }
          }
          return y;
        });
        return x;
      });

      // Update state on server side
      this.deviceService
        .updateState(device.id, state)
        .pipe(first())
        .subscribe((data) => {
          console.log(data);
        });
    } else if (device.type === DeviceE.Fan) {
      const fan = device as DeviceFan;
      const state = fan.fan.state === StateE.Off ? StateE.On : StateE.Off;

      // Update state on client. This process to avoid delay view on client while
      // waiting response from server
      this.groups.map((x) => {
        x.devices.map((y) => {
          if (y.id === device.id) {
            if (y.type === DeviceE.Fan) {
              (y as DeviceFan).fan.state = state;
            }
          }
          return y;
        });
        return x;
      });

      // Update state on server side
      this.deviceService
        .updateState(device.id, state)
        .pipe(first())
        .subscribe((data) => {});
    }
  }

  isStateOn(device: Device) {
    if (device.type === DeviceE.Light) {
      return (device as DeviceLight).light.state === StateE.On;
    } else if (device.type === DeviceE.Fan) {
      return (device as DeviceFan).fan.state === StateE.On;
    } else {
      return false;
    }
  }
}
