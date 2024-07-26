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
import { DeviceOld } from '../../../../types/device-old.type';
import { StateE } from '../../../../enums/state.enum';
import { DeviceService } from '../../../../services/device.service';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { registerIcon } from '../../../../functions/register-icon.func';
import { MatFabButton } from '@angular/material/button';
import { SocketService } from '../../../../services/socket.service';

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

    // register svg icon
    registerIcon(['fan', 'light'], sanitizer, iconRegistry);
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
        this.refreshGroup$.next();
      });
  }

  initObservable() {
    this.groups$ = this.refreshGroup$.pipe(
      startWith(true),
      switchMap((x) => this.groupService.getAll()),
      takeUntil(this.destroyed),
    );

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
    const state = device.state === StateE.Off ? StateE.On : StateE.Off;
    this.deviceService
      .updateState(device.id, state)
      .pipe(first())
      .subscribe((data) => {});
  }

  isStateOn(state: StateE) {
    return state === StateE.On;
  }

  statusLabel(state: StateE) {
    return state === StateE.Off ? 'Off' : 'On';
  }
}
