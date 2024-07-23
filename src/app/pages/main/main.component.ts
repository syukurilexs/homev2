import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';

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
      shareReplay()
    );
}
