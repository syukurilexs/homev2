import { Location, TitleCasePipe } from '@angular/common';
import { Component, ɵɵgetInheritedFactory } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateRpi } from '../../../../../types/create-rpi.type';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DeviceService } from '../../../../../services/device.service';
import { first } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceE } from '../../../../../enums/device-type.enum';
import { Rpi } from '../../../../../types/rpi.type';

@Component({
  selector: 'app-rpi',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  templateUrl: './rpi.component.html',
  styleUrl: './rpi.component.scss',
})
export class RpiComponent {
  title = 'Add rpi';
  fg!: FormGroup;
  id = -1;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private deviceService: DeviceService,
    private snackBar: MatSnackBar,
  ) {
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
        this.title = 'Update Rpi';
      }
    });
  }

  updateForm() {
    this.deviceService
      .getById<Rpi>(this.id)
      .pipe(first())
      .subscribe({
        next: (x) => {
          this.fg.patchValue({
            name: x.name,
            topic: x.topic,
            on: x.on,
            off: x.off,
          });
        },
        error: (err) => {
          this._notifyError('Failed to load rpi');
          console.error(err);
        },
      });
  }

  initForm() {
    this.fg = this.fb.group({
      name: ['', Validators.required],
      topic: ['', Validators.required],
      on: ['', Validators.required],
      off: ['', Validators.required],
    });
  }

  onSubmit() {
    const input: CreateRpi = {
      name: this.fg.controls['name'].value,
      topic: this.fg.controls['topic'].value,
      on: this.fg.controls['on'].value,
      off: this.fg.controls['off'].value,
    };

    if (this.id === -1) {
      // Create rpi
      this.deviceService
        .createRpi(input)
        .pipe(first())
        .subscribe({
          next: () => {
            this._notify('Rpi created successfully');
            this.location.back();
          },
          error: (err) => {
            this._notifyError('Failed to create rpi');
            console.error(err);
          },
        });
    } else {
      // Update rpi
      this.deviceService
        .updateRpiById(this.id, input)
        .pipe(first())
        .subscribe({
          next: () => {
            this._notify('Rpi updated successfully');
            this.location.back();
          },
          error: (err) => {
            this._notifyError('Failed to update rpi');
            console.error(err);
          },
        });
    }
  }

  onCancel() {
    this.location.back();
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
}
