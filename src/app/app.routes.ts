import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { DashboardComponent } from './pages/main/dashboard/dashboard.component';
import { DeviceE } from './enums/device-type.enum';

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
            path: 'device/' + DeviceE.Fan,
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-fan/form-fan.component'
              ).then((x) => x.FormFanComponent),
          },
          {
            path: 'device/' + DeviceE.Fan + '/:id',
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-fan/form-fan.component'
              ).then((x) => x.FormFanComponent),
          },
          {
            path: 'device/' + DeviceE.Light,
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-fan/form-fan.component'
              ).then((x) => x.FormFanComponent),
          },
          {
            path: 'device/' + DeviceE.Light + '/:id',
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-fan/form-fan.component'
              ).then((x) => x.FormFanComponent),
          },
          {
            path: 'device/' + DeviceE.Switch,
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-suis/form-suis.component'
              ).then((x) => x.FormSuisComponent),
          },
          {
            path: 'device/' + DeviceE.Switch + '/:id',
            loadComponent: () =>
              import(
                '../app/pages/main/admin/device/form-suis/form-suis.component'
              ).then((x) => x.FormSuisComponent),
          },
          {
            path: 'group',
            loadComponent: () =>
              import('../app/pages/main/admin/group/group.component').then(
                (x) => x.GroupComponent,
              ),
          },
          {
            path: 'group/create',
            loadComponent: () =>
              import('../app/pages/main/admin/group/form/form.component').then(
                (x) => x.FormComponent,
              ),
          },
          {
            path: 'group/edit/:id',
            loadComponent: () =>
              import('../app/pages/main/admin/group/form/form.component').then(
                (x) => x.FormComponent,
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
            path: 'scene/add',
            loadComponent: () =>
              import('../app/pages/main/admin/scene/form/form.component').then(
                (x) => x.FormComponent,
              ),
          },
          {
            path: 'scene/edit/:id',
            loadComponent: () =>
              import('../app/pages/main/admin/scene/form/form.component').then(
                (x) => x.FormComponent,
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
            path: 'timer/add',
            loadComponent: () =>
              import('../app/pages/main/admin/timer/form/form.component').then(
                (x) => x.FormComponent,
              ),
          },
          {
            path: 'timer/edit/:id',
            loadComponent: () =>
              import('../app/pages/main/admin/timer/form/form.component').then(
                (x) => x.FormComponent,
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
