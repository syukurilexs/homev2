import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { registerIcon } from '../../functions/register-icon.func';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);

  routes = [
    {
      name: 'Dashboard',
      path: 'dashboard',
    },
    {
      name: 'Admin',
      path: 'admin',
      sub: [
        {
          name: 'Device',
          path: 'device',
        },
        {
          name: 'Group',
          path: 'group',
        },
        {
          name: 'Scene',
          path: 'scene',
        },
        {
          name: 'Timer',
          path: 'timer',
        },
        {
          name: 'Monitor',
          path: 'monitor',
        },
      ],
    },
  ];

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(),
    );

  icons = [
    'dashboard',
    'admin',
    'group',
    'device',
    'scene',
    'timer',
    'monitor',
  ];

  constructor(domSanitizer: DomSanitizer, matIconRegistry: MatIconRegistry) {
    registerIcon(this.icons, domSanitizer, matIconRegistry);
  }


}
