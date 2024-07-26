import { NgClass } from '@angular/common';
import { Component, Sanitizer } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { registerIcon } from '../../../../functions/register-icon.func';

@Component({
  selector: 'app-device',
  standalone: true,
  imports: [MatCard, MatFabButton, MatIcon, RouterOutlet, NgClass],
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  active = 'fan';

  devices = [
    {
      name: 'Fans',
      icon: 'fan',
    },
    {
      name: 'Light',
      icon: 'light',
    },
    {
      name: 'Switch',
      icon: 'switch',
    },
  ];

  constructor(sanitizer: DomSanitizer, iconRegistery: MatIconRegistry) {
    registerIcon(
      this.devices.map((x) => x.icon),
      sanitizer,
      iconRegistery,
    );
  }

  onClick(icon: string) {
    this.active = icon;
  }
}
