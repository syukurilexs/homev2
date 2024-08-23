import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Light } from '../../../../../types/light.type';
import { FanOld } from '../../../../../types/fan.type';
import { first, lastValueFrom, map, Observable } from 'rxjs';
import { DeviceService } from '../../../../../services/device.service';
import { DeviceE } from '../../../../../enums/device-type.enum';
import { AsyncPipe, Location } from '@angular/common';
import { TimerService } from '../../../../../services/timer.service';
import { CreateTimer } from '../../../../../types/create-timer.type';
import { StateE } from '../../../../../enums/state.enum';
import { OptionE } from '../../../../../enums/option.enum';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TimerDevice } from '../../../../../types/timer-device.type';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  title = 'Add timer';
  devices$!: Observable<Light[] | FanOld[]>;
  fg!: FormGroup;
  id = -1;

  constructor(
    private deviceService: DeviceService,
    private timerService: TimerService,
    private location: Location,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.initObservable();
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
        this.title = 'Update Timer';
      }
    });
  }

  initForm() {
    this.fg = this.fb.group({
      device: ['', Validators.required],
      time: ['', Validators.required],
      state: [true],
      status: [true],
    });
  }

  initObservable() {
    this.devices$ = this.deviceService.getAll<Light[] | FanOld[]>().pipe(
      map((x) => {
        return x.filter(
          (y) => y.type === DeviceE.Fan || y.type === DeviceE.Light,
        );
      }),
    );
  }

  updateForm() {
    this.timerService
      .getById<TimerDevice>(this.id)
      .pipe(first())
      .subscribe((x) => {
        this.fg.patchValue({
          device: x.device.id,
          time: this._convertTo24Hour(x.time),
          state: x.state === StateE.On,
          status: x.option === OptionE.Enable,
        });

        this.fg.controls['device'].disable();
      });
  }

  onCancel() {
    this.location.back();
  }

  async onSubmit() {
    const time = this.fg.get('time')?.value || '';

    const input: CreateTimer = {
      deviceId: this.fg.get('device')?.value || -1,
      state: this.fg.get('state')?.value ? StateE.On : StateE.Off,
      time: this._convertTo12Hour(time),
      option: this.fg.get('status')?.value ? OptionE.Enable : OptionE.Disable,
    };

    if (this.id === -1) {
      try {
        await lastValueFrom(this.timerService.create(input));
        this.notify('Timer created successfully');
        this.location.back();
      } catch (error) {
        this.notifyError('Failed to create timer');
      }
    } else {
      try {
        await lastValueFrom(this.timerService.updateById(input, this.id));
        this.notify('Timer updated successfully');
        this.location.back();
      } catch (error) {
        this.notifyError('Failed to update timer');
      }
    }
  }

  notify(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000 });
  }

  notifyError(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error',
    });
  }

  private _convertTo24Hour(time: string) {
    // Split the time string into its components
    const [timePart, modifier] = time.split(' ');

    // Split the timePart into hours and minutes
    let [hours, minutes] = timePart.split(':').map(Number);

    // Adjust hours for AM/PM
    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    // Format the hours and minutes to always be two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the formatted 24-hour time
    return `${formattedHours}:${formattedMinutes}`;
  }

  private _convertTo12Hour(time: string): string {
    // Split the time string into hours and minutes
    let [hours, minutes] = time.split(':').map(Number);

    // Determine the AM/PM modifier
    const modifier = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12; // Converts 0 to 12 for midnight, 13 to 1, etc.

    // Format the hours and minutes to always be two digits
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    // Return the formatted 12-hour time with AM/PM
    return `${formattedHours}:${formattedMinutes} ${modifier}`;
  }
}
