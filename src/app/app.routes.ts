import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'admin',
        loadComponent: () =>
          import('../app/pages/main/admin/admin.component').then(
            (x) => x.AdminComponent,
          ),

        children: [
          {
            path: 'device',
            loadComponent: () =>
              import('../app/pages/main/admin/device/device.component').then(
                (x) => x.DeviceComponent,
              ),
          },
          {
            path: 'device/fan',
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-fan/form-fan.component'
              ).then((x) => x.FormFanComponent),
          },
          {
            path: 'device/fan/:id',
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-fan/form-fan.component'
              ).then((x) => x.FormFanComponent),
          },
          {
            path: 'group',
            loadComponent: () =>
              import('../app/pages/main/admin/group/group.component').then(
                (x) => x.GroupComponent,
              ),
          },
          {
            path: 'scene',
            loadComponent: () =>
              import('../app/pages/main/admin/scene/scene.component').then(
                (x) => x.SceneComponent,
              ),
          },
          {
            path: 'timer',
            loadComponent: () =>
              import('../app/pages/main/admin/timer/timer.component').then(
                (x) => x.TimerComponent,
              ),
          },
          {
            path: 'monitor',
            loadComponent: () =>
              import('../app/pages/main/admin/monitor/monitor.component').then(
                (x) => x.MonitorComponent,
              ),
          },
        ],
      },
    ],
  },
];
