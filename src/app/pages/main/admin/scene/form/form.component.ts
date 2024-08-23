import { Location, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Device } from '../../../../../types/device.type';
import { DeviceService } from '../../../../../services/device.service';
import { first, lastValueFrom, map } from 'rxjs';
import { DeviceE } from '../../../../../enums/device-type.enum';
import { MatDividerModule } from '@angular/material/divider';
import { SceneDevice } from '../../../../../types/scene.type';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StateE } from '../../../../../enums/state.enum';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CreateScene } from '../../../../../types/create-scene.type';
import { SceneService } from '../../../../../services/scene.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceSuis } from '../../../../../types/device-suis.type';
import { ActionSuis } from '../../../../../types/action-suis.type';

// Create temporary scene device to make it easier to attached
// the state to mat-slide-toggle (check property is using boolean)
type TmpSceneDevice = SceneDevice & { bState: boolean };

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatInput,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    TitleCasePipe,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  title = 'Add scene';
  fg!: FormGroup;
  id = -1;

  deviceSource: WritableSignal<Device[]> = signal([]);
  selectedDevice: WritableSignal<TmpSceneDevice[]> = signal([]);
  devices!: Signal<Device[]>;

  switchesSource: WritableSignal<DeviceSuis[]> = signal([]);
  switches!: Signal<DeviceSuis[]>;
  selectedAction: ActionSuis[] = [];
  actionSuises: ActionSuis[] = [];

  constructor(
    private deviceService: DeviceService,
    private sceneService: SceneService,
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.loadDevices();
    this.loadSwitches();
    this.computeDevice();
    this.computeSwitche();
    this.initForm();
    this.getRouteParam();
  }

  loadActionSuises() {
    this.deviceService
      .getAllAction<ActionSuis>()
      .pipe(first())
      .subscribe((x) => {
        this.actionSuises = x;
      });
  }

  getRouteParam() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id') !== null) {
        this.id = (params.get('id') as any) || -1;

        // Updating form with information from server
        this.updateForm();

        // Change subtitle
        this.title = 'Update Scene';
      } else {
        this.loadActionSuises();
      }
    });
  }

  async updateForm() {
    try {
      const scene = await lastValueFrom(this.sceneService.getById(this.id));
      this.actionSuises = await lastValueFrom(
        this.deviceService.getAllAction<ActionSuis>(),
      );

      // Update form
      this.fg.patchValue({
        name: scene.name,
      });

      // Set selected device
      this.selectedDevice.set(
        scene.sceneDevice.map((y) => {
          return {
            state: y.state,
            device: y.device,
            bState: y.state === StateE.On,
          };
        }),
      );

      // Set selected action
      this.selectedAction = this.actionSuises.filter((y) => {
        const index = scene.sceneAction.findIndex((z) => y.id === z.actionId);
        return index !== -1;
      });
    } catch (error) {
      this._notifyError('Failed to update form');
      console.log(error);
    }
  }

  computeSwitche() {
    this.switches = computed(() => {
      return this.switchesSource();
    });
  }

  loadSwitches() {
    this.deviceService
      .getAllByType<DeviceSuis[]>(DeviceE.Switch)
      .pipe(first())
      .subscribe((x) => {
        this.switchesSource.set(x);
      });
  }

  initForm() {
    this.fg = this.fb.group({
      name: ['', Validators.required],
      device: [],
      suis: [''],
      action: [''],
    });
  }

  computeDevice() {
    this.devices = computed(() => {
      // If selected device is empty just return the source
      if (this.selectedDevice().length === 0) {
        return this.deviceSource();
      }

      // Filter source if item already in selected device
      return this.deviceSource().filter((x) => {
        return !this.selectedDevice().some((y) => y.device.id === x.id);
      });
    });
  }

  loadDevices() {
    this.deviceService
      .getAll<Device[]>()
      .pipe(
        first(),
        map((x) =>
          x.filter((y) => y.type === DeviceE.Fan || y.type === DeviceE.Light),
        ),
      )
      .subscribe((x) => {
        this.deviceSource.set(x);
      });
  }

  addDevice() {
    const device = this.fg.get('device')?.value;

    // Add if only device selected
    if (device) {
      this.selectedDevice.update((x) => [
        ...this.selectedDevice(),
        { state: StateE.Off, device, bState: false },
      ]);
    }

    // Clear after add to avoid duplicate
    this.fg.get('device')?.setValue('');
  }

  addSuis() {
    const suis = this.fg.get('suis')?.value || '';
    const action = this.fg.get('action')?.value || '';

    // Get selected switch
    const actionSuis = this.actionSuises.find((x) => x.id === action.id);

    // Add to selected switches
    if (actionSuis) {
      this.selectedAction.push(actionSuis);
    }

    // Reset after add
    this.fg.get('action')?.setValue('');
  }

  getActions(deviceSuis: DeviceSuis) {
    if (deviceSuis) {
      return deviceSuis.suis.actions;
    }
    return [];
  }

  onCancel() {
    this.location.back();
  }

  onRemoveDevice(sceneDevice: SceneDevice) {
    const index = this.selectedDevice().findIndex(
      (x) => x.device.id === sceneDevice.device.id,
    );

    if (index > -1) {
      // Remove selected device
      this.selectedDevice().splice(index, 1);

      // Create new device to trigger the change
      this.selectedDevice.set([...this.selectedDevice()]);
    }
  }

  async onSubmit() {
    const newScene: CreateScene = {
      name: this.fg.get('name')?.value || '',
      actions: this.selectedAction.map((x) => x.id || -1) || [],
      devices: this.selectedDevice().map((x) => {
        return {
          id: x.device.id,
          // Need to use StateE instead of boolean
          state: x.bState ? StateE.On : StateE.Off,
        };
      }),
    };

    if (this.id > -1) {
      // Update scene
      try {
        await lastValueFrom(this.sceneService.updateById(this.id, newScene));
        this._notify('Scene updated successfully');
        this.location.back();
      } catch (error) {
        this._notifyError('Failed to update scene');
      }
    } else {
      // Create scene
      try {
        await lastValueFrom(this.sceneService.create(newScene));
        this._notify('Scene created successfully');
        this.location.back();
      } catch (error) {
        this._notifyError('Failed to create scene');
      }
    }
  }

  private _notify(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }

  private _notifyError(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error',
    });
  }

  onToggleChange(index: number) {
    const currentDevice = this.selectedDevice().at(index);

    if (currentDevice) {
      currentDevice.bState = !currentDevice.bState;
      currentDevice.state = currentDevice.bState ? StateE.On : StateE.Off;
    }
  }

  onRemoveAction(action: ActionSuis) {
    // Remove action from the selected list
    const index = this.selectedAction.findIndex((x) => x.id === action.id);
    this.selectedAction.splice(index, 1);
  }
}
