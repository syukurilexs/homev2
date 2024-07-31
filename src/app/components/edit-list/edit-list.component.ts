import { Component, effect, input, output } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { DeviceService } from '../../services/device.service';
import { DeviceE } from '../../enums/device-type.enum';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { Device } from '../../types/device.type';

@Component({
  selector: 'app-edit-list',
  standalone: true,
  imports: [
    MatCard,
    MatMiniFabButton,
    MatIcon,
    MatDivider,
    AsyncPipe,
    JsonPipe,
  ],
  templateUrl: './edit-list.component.html',
  styleUrl: './edit-list.component.scss',
})
export class EditListComponent {
  curDevice = input<DeviceE>(DeviceE.Fan);
  info = output<Device>();
  edit = output<Device>();
  remove = output<Device>();

  model$!: Observable<Device[]>;
  refreshModel$ = new BehaviorSubject(DeviceE.Fan);

  constructor(private deviceService: DeviceService) {
    this.initObservable();

    effect(() => {
      if (this.curDevice()) {
        this.refreshModel$.next(this.curDevice());
      }
    });
  }

  initObservable() {
    this.model$ = this.refreshModel$.pipe(
      switchMap((x) => this.deviceService.getAllByType<Device[]>(x)),
    );
  }

  onDelete(data: Device) {
    this.remove.emit(data);
  }

  onEdit(data: Device) {
    this.edit.emit(data);
  }

  onInfo(data: Device) {
    this.info.emit(data);
  }

  refresh(device: DeviceE) {
    this.refreshModel$.next(device);
  }
}
