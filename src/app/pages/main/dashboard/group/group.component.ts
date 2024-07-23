import { Component } from '@angular/core';
import { GroupService } from '../../../../services/group.service';
import { map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { Group } from '../../../../types/group.type';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DeviceE } from '../../../../enums/device-type.enum';
import { DeviceOld } from '../../../../types/device-old.type';
import { StateE } from '../../../../enums/state.enum';
import { DeviceService } from '../../../../services/device.service';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { registerIcon } from '../../../../functions/register-icon.func';
import { MatFabAnchor, MatFabButton } from '@angular/material/button';

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
export class GroupComponent {
  isHandset$!: Observable<boolean>;
  groups$!: Observable<Group[]>;
  destroyed = new Subject<void>();

  constructor(
    private groupService: GroupService,
    private breakpointObserver: BreakpointObserver,
    private deviceService: DeviceService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.initObservable();

    // register svg icon
    registerIcon(['fan', 'light'], sanitizer, iconRegistry);
  }

  initObservable() {
    this.groups$ = this.groupService.getAll();

    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
      takeUntil(this.destroyed),
    );
  }

  convertIconString(type: DeviceE) {
    if (type === DeviceE.Fan) {
      return 'fan';
    } else {
      return 'light';
    }
  }

  onClicked(device: DeviceOld) {
    // const state = device.state === StateE.Off ? StateE.On : StateE.Off;
    // this.deviceService.updateState(device.id, state).subscribe((data) => {});
    // this.group.devices.map((x) => {
    //   if (x.id === device.id) {
    //     x.state = state;
    //   }
    //   return x;
    // });
  }

  isStateOn(state: StateE) {
    return state === StateE.On;
  }

  statusLabel(state: StateE) {
    return state === StateE.Off ? 'Off' : 'On';
  }
}
