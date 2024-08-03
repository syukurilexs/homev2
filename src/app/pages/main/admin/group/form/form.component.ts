import { AsyncPipe, Location, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { DeviceService } from '../../../../../services/device.service';
import { Device } from '../../../../../types/device.type';
import {
  debounceTime,
  distinctUntilChanged,
  first,
  lastValueFrom,
  map,
} from 'rxjs';
import { DeviceE } from '../../../../../enums/device-type.enum';
import { GroupService } from '../../../../../services/group.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    TitleCasePipe,
    AsyncPipe,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  title = 'Add group';
  fg!: FormGroup;
  id = -1;

  devices!: Signal<Device[]>;
  selected: WritableSignal<Device[]> = signal([]);
  sourceDevice: WritableSignal<Device[]> = signal([]);

  constructor(
    private deviceService: DeviceService,
    private groupService: GroupService,
    private fb: FormBuilder,
    private location: Location,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.computeDevices();
    this.loadDevices();
    this.initForm();
    this.getRouteParam();
  }

  getRouteParam() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id') !== null) {
        this.id = (params.get('id') as any) || -1;

        // Updating form with information from server
        this.updateForm();

        // Change subtitle
        this.title = 'Update Group';
      }
    });
  }

  updateForm() {
    this.groupService
      .getById(this.id)
      .pipe(first())
      .subscribe((x) => {
        // Update selected device
        this.selected.set(x.devices);

        // Update name
        this.fg.patchValue({
          name: x.name,
        });
      });
  }

  initForm() {
    this.fg = this.fb.group({
      name: ['', Validators.required],
      device: [''],
    });

    this.fg
      .get('device')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(200))
      .subscribe((x) => {});
  }

  computeDevices() {
    this.devices = computed(() => {
      // If selected is empty return all
      if (this.selected().length === 0) {
        return this.sourceDevice();
      }

      // If selected has value then filter selected from source
      return this.sourceDevice().filter(
        (x) => !this.selected().some((y) => y.id === x.id),
      );
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
        this.sourceDevice.set(x);
      });
  }

  onSelected(event: MatAutocompleteSelectedEvent) {
    this.selected.update((x) => [...x, event.option.value]);
    event.option.deselect();
  }

  removeSelectedDevice(data: Device) {
    this.selected.update((y) => [
      ...this.selected().filter((x) => x.id !== data.id),
    ]);
  }

  async onSubmit() {
    const name = this.fg.get('name')?.value || '';
    const deviceIds = this.selected().map((x) => x.id);

    if (this.id > -1) {
      // Update group
      try {
        await lastValueFrom(
          this.groupService.updateById(this.id, {
            name,
            deviceIds,
          }),
        );
        this.notify('Group updated successfully');
        this.location.back();
      } catch (error) {
        this.notifyError('Failed to update group');
      }
    } else {
      // Create new group
      try {
        await lastValueFrom(
          this.groupService.create({
            name,
            deviceIds,
          }),
        );
        this.notify('Group created successfully');
        this.location.back();
      } catch (error) {
        this.notifyError('Failed to create group');
      }
    }
  }

  onCancel() {
    this.location.back();
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
