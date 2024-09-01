import { JsonPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { MatFabButton, MatMiniFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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
import { first, lastValueFrom, Observable } from 'rxjs';
import { DeviceService } from '../../../../services/device.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormFanComponent } from './form-fan/form-fan.component';
import { Device } from '../../../../types/device.type';
import { getAsFan, getAsSuis } from '../../../../functions/type.func';
import { DeviceSuis } from '../../../../types/device-suis.type';
import { DeviceLight } from '../../../../types/device-light.type';
import { DeviceFan } from '../../../../types/device-fan.type';
import { DeviceActuator } from '../../../../types/device-actuator.type';

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
    JsonPipe,
  ],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  getAsFan = getAsFan;
  getAsSuis = getAsSuis;

  currentDevice = DeviceE.Fan;
  //deviceInfo!: DeviceSuis | DeviceLight | DeviceFan | undefined;
  deviceInfo!: Device | undefined;
  DeviceEnum = DeviceE;
  devices: Device[] = [];

  icons = [
    {
      name: 'Fans',
      icon: DeviceE.Fan,
      type: DeviceE.Fan,
    },
    {
      name: 'Light',
      icon: DeviceE.Light,
      type: DeviceE.Light,
    },
    {
      name: 'Switch',
      icon: DeviceE.Switch,
      type: DeviceE.Switch,
    },
    {
      name: 'Actuator',
      icon: DeviceE.Switch,
      type: DeviceE.Actuator,
    },
  ];

  suisInfo: DeviceSuis | undefined;
  fanInfo: DeviceFan | undefined;
  lightInfo: DeviceLight | undefined;
  actuatorInfo: DeviceActuator | undefined;

  constructor(
    sanitizer: DomSanitizer,
    iconRegistery: MatIconRegistry,
    private deviceService: DeviceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    registerIcon(
      this.icons.map((x) => x.icon as string),
      sanitizer,
      iconRegistery,
    );

    // Reload the list of device base on default type (fan)
    this.reload();
  }

  onSetCurrentDevice(device: DeviceE) {
    this.deviceInfo = undefined;
    this.currentDevice = device;

    this.reload();
  }

  reload() {
    this.deviceService
      .getAllByType<Device[]>(this.currentDevice)
      .pipe(first())
      .subscribe((x) => (this.devices = x));
  }

  async onRemove(id: number) {
    try {
      await lastValueFrom(this.deviceService.deleteById(id));
      this.reload();
      this._snackBar.open('Device deleted', 'Close', {
        duration: 3000,
      });
    } catch (error) {
      this._snackBar.open('Failed to delete device', 'Close', {
        duration: 3000,
      });
    }
  }

  onEdit(id: number) {
    this.router.navigate([this.currentDevice, id], {
      relativeTo: this.route,
    });
  }

  async onInfo(id: number) {
    //this.deviceInfo = data;
    const index = this.devices.findIndex((x) => x.id === id);
    if (index > -1) {
      this.deviceInfo = this.devices.at(index);

      // Default to undefined
      this.suisInfo = undefined;
      this.fanInfo = undefined;
      this.lightInfo = undefined;
      this.actuatorInfo = undefined;

      // Set current device
      if (this.currentDevice === DeviceE.Switch) {
        this.suisInfo = this.devices.at(index) as DeviceSuis;
      } else if (this.currentDevice === DeviceE.Fan) {
        this.fanInfo = this.devices.at(index) as DeviceFan;
      } else if (this.currentDevice === DeviceE.Light) {
        this.lightInfo = this.devices.at(index) as DeviceLight;
      } else if (this.currentDevice === DeviceE.Actuator) {
        this.actuatorInfo = this.devices.at(index) as DeviceActuator;
      }
    }
  }

  onAdd() {
    this.router.navigate([this.currentDevice], { relativeTo: this.route });
  }
}
