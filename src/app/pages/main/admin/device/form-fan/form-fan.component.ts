import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule, MatMiniFabButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { first, lastValueFrom, Observable } from 'rxjs';
import { DeviceService } from '../../../../../services/device.service';
import { DeviceE } from '../../../../../enums/device-type.enum';
import { AsyncPipe, Location } from '@angular/common';
import { Action } from '../../../../../types/action.type';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceFan } from '../../../../../types/device-fan.type';
import { DeviceSuis } from '../../../../../types/device-suis.type';
import { ActionSuis } from '../../../../../types/action-suis.type';
import { DeviceLight } from '../../../../../types/device-light.type';
import { DeviceActuator } from '../../../../../types/device-actuator.type';
import { Device } from '../../../../../types/device.type';

@Component({
  selector: 'app-form-fan',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    ReactiveFormsModule,
    MatMiniFabButton,
    MatDivider,
    MatIcon,
    AsyncPipe,
  ],
  templateUrl: './form-fan.component.html',
  styleUrl: './form-fan.component.scss',
})
export class FormFanComponent implements OnInit {
  title = 'Add Fan';
  fg!: FormGroup;
  suis$!: Observable<DeviceSuis[]>;
  actions: Action[] = [];
  selectedActionSuiss: ActionSuis[] = [];
  actionSuiss: ActionSuis[] = [];
  deviceActuator$!: Observable<DeviceActuator[]>;
  id = -1;
  currentType: DeviceE = DeviceE.Fan;

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.initFg();
    this.initObservable();
    this.getRouteParam();
  }

  reloadActionSuis() {
    this.deviceService
      .getAllAction<ActionSuis>()
      .pipe(first())
      .subscribe((x) => {
        this.actionSuiss = x;
      });
  }

  initObservable() {
    this.suis$ = this.deviceService.getAllByType<DeviceSuis[]>(DeviceE.Switch);
    this.deviceActuator$ = this.deviceService.getAllByType<DeviceActuator[]>(
      DeviceE.Actuator,
    );
  }

  initFg() {
    this.fg = this.fb.group({
      name: ['', Validators.required],
      mqttTopic: ['', Validators.required],
      actuator: [-1, Validators.required],
      remark: [''],
      suis: [''],
      action: [''],
    });

    this.fg.get('suis')?.valueChanges.subscribe((x: DeviceSuis) => {
      this.actions = x.suis.actions;
    });
  }

  async updateForm() {
    if (this.currentType === DeviceE.Fan) {
      try {
        // Get devices by id
        const device = await lastValueFrom(
          this.deviceService.getById<DeviceFan>(this.id),
        );

        // Get actions
        const actionSuiss = await lastValueFrom(
          this.deviceService.getAllAction<ActionSuis>(),
        );

        this.actionSuiss = actionSuiss;

        // Update form
        this.fg.patchValue({
          name: device.name,
          mqttTopic: device.fan.topic,
          remark: device.remark,
          actuator: device.fan.actuator.id,
        });

        // Update selected action switches
        this.selectedActionSuiss = this.actionSuiss.filter((x) => {
          const index = device.fan.actions.findIndex((y) => y.id === x.id);

          if (index === -1) return false;

          return true;
        });
      } catch (error) {
        this.notifyError('Failed to update form for fan');
        console.error(error);
      }
    } else {
      // Light
      try {
        // Get devices by id
        const device = await lastValueFrom(
          this.deviceService.getById<DeviceLight>(this.id),
        );

        // Get actions
        const actionSuiss = await lastValueFrom(
          this.deviceService.getAllAction<ActionSuis>(),
        );

        this.actionSuiss = actionSuiss;

        // Update form
        this.fg.patchValue({
          name: device.name,
          mqttTopic: device.light.topic,
          remark: device.remark,
          actuator: device.light.actuator.id,
        });

        // Update selected action switches
        this.selectedActionSuiss = this.actionSuiss.filter((x) => {
          const index = device.light.actions.findIndex((y) => y.id === x.id);

          if (index === -1) return false;

          return true;
        });
      } catch (error) {
        this.notifyError('Failed to update form for light');
        console.error(error);
      }
    }
  }

  getRouteParam() {
    // Get url path
    const urls = this.route.snapshot.url;
    if (urls.length === 2) {
      if (urls[1].path === DeviceE.Fan) {
        this.currentType = DeviceE.Fan;
        this.title = 'Add fan';
      } else if (urls[1].path === DeviceE.Light) {
        this.title = 'Add light';
        this.currentType = DeviceE.Light;
      }
    } else if (urls.length === 3) {
      if (urls[1].path === DeviceE.Fan) {
        this.currentType = DeviceE.Fan;
        this.title = 'Update fan';
      } else if (urls[1].path === DeviceE.Light) {
        this.title = 'Update light';
        this.currentType = DeviceE.Light;
      }
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id') !== null) {
        // Update
        this.id = (params.get('id') as any) || -1;

        // Updating form with information from server
        this.updateForm();
      } else {
        // Create
        this.reloadActionSuis();
      }
    });
  }

  async onSubmit() {
    const input = {
      actions: this.selectedActionSuiss.map((x) => x.id),
      name: this.fg.get('name')?.value,
      topic: this.fg.get('mqttTopic')?.value,
      remark: this.fg.get('remark')?.value,
      actuator: this.fg.get('actuator')?.value || -1,
    };

    if (this.id > -1) {
      // Update

      if (this.currentType === DeviceE.Fan) {
        // Fan
        try {
          await lastValueFrom(this.deviceService.updateFanById(this.id, input));
          this.notify('Successfully updating fan');
          this.location.back();
        } catch (error) {
          this.notifyError('Failed to update fan');
        }
      } else {
        // Light
        try {
          await lastValueFrom(
            this.deviceService.updateLightById(this.id, input),
          );
          this.notify('Successfully updating light');
          this.location.back();
        } catch (error) {
          this.notifyError('Failed to update light');
        }
      }
    } else {
      // Create

      if (this.currentType === DeviceE.Fan) {
        // Fan
        try {
          await lastValueFrom(this.deviceService.createFan(input));
          this.notify('Successfully creating new fan');
          this.location.back();
        } catch (error) {
          this.notifyError('Failed to create new fan');
        }
      } else {
        // Light
        try {
          await lastValueFrom(this.deviceService.createLight(input));
          this.notify('Successfully creating new light');
          this.location.back();
        } catch (error) {
          this.notifyError('Failed to create new light');
        }
      }
    }
  }

  onAddSuisAction() {
    const suis = this.fg.get('suis')?.value;
    const action = this.fg.get('action')?.value;

    // Get action id
    const actionSuis = this.actionSuiss.find((x) => x.id === action.id);

    if (actionSuis) {
      this.selectedActionSuiss.push(actionSuis);
    }
  }

  back() {
    this.location.back();
  }

  onRemoveAction(id: number) {
    const index = this.selectedActionSuiss.findIndex((x) => x.id === id);

    if (index > -1) {
      this.selectedActionSuiss.splice(index, 1);
    }
  }

  getSuisName(action: Action) {
    const name = action.suis?.device?.name;

    if (name) return name;

    return '';
  }

  notify(msg: string) {
    this._snackBar.open(msg, 'Close', { duration: 3000 });
  }

  notifyError(msg: string) {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error',
    });
  }
}
