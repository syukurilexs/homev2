import { Location, NgClass } from '@angular/common';
import { Component, Sanitizer, ViewChild } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { registerIcon } from '../../../../functions/register-icon.func';
import { EditListComponent } from '../../../../components/edit-list/edit-list.component';
import { DeviceE } from '../../../../enums/device-type.enum';
import { lastValueFrom } from 'rxjs';
import { DeviceService } from '../../../../services/device.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormFanComponent } from './form-fan/form-fan.component';
import { Device } from '../../../../types/device.type';
import { Fan } from '../../../../types/fan.type';
import { getAsFan } from '../../../../functions/type.func'

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [
    MatCardModule,
    MatFabButton,
    MatMiniFabButton,
    MatIcon,
    RouterOutlet,
    NgClass,
    RouterLink,
    EditListComponent,
    FormFanComponent,
  ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  getAsFan = getAsFan;

  currentDevice = DeviceE.Fan;
  @ViewChild(EditListComponent) editListComponent!: EditListComponent;
  deviceInfo!: Device | undefined;
  DeviceEnum = DeviceE;

  devices = [
    {
      name: 'Fans',
      icon: DeviceE.Fan,
    },
    {
      name: 'Light',
      icon: DeviceE.Light,
    },
    {
      name: 'Switch',
      icon: DeviceE.Switch,
    },
  ];

  constructor(
    sanitizer: DomSanitizer,
    iconRegistery: MatIconRegistry,
    private deviceService: DeviceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    registerIcon(
      this.devices.map((x) => x.icon as string),
      sanitizer,
      iconRegistery,
    );
  }

  onClick(icon: DeviceE) {
    this.deviceInfo = undefined;
    this.currentDevice = icon;
  }

  async onRemove(data: Device) {
    try {
      await lastValueFrom(this.deviceService.deleteById(data.id));
      this.editListComponent.refresh(this.currentDevice);
      this._snackBar.open('Device deleted', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      this._snackBar.open('Failed to delete device', 'Close', {
        duration: 3000,
      });
    }
  }

  onEdit(data: Device) {
    this.router.navigate(['fan', data.id], { relativeTo: this.route });
  }

  async onInfo(data: Device) {
    this.deviceInfo = data;
  }

  onAdd() {
    this.router.navigate(['fan'], { relativeTo: this.route });
  }

}
