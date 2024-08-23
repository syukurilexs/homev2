import { Location } from '@angular/common';
import { Component } from '@angular/core';
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
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { lastValueFrom } from 'rxjs';
import { DeviceService } from '../../../../../services/device.service';
import { CreateAction } from '../../../../../types/create-action.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceSuis } from '../../../../../types/device-suis.type';

@Component({
  selector: 'app-form-suis',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './form-suis.component.html',
  styleUrl: './form-suis.component.scss',
})
export class FormSuisComponent {
  fg!: FormGroup;
  title = 'Add Switch';
  id = -1;
  createActions: CreateAction[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private deviceService: DeviceService,
    private _snackBar: MatSnackBar,
  ) {
    this.initFg();
    this.getRouteParam();
  }

  getRouteParam() {
    this.route.paramMap.subscribe((param: ParamMap) => {
      const id = param.get('id');
      if (id !== null) {
        this.id = +id || -1;
        this.title = 'Update Switch';
        this.updateForm();
      } else {
        this.title = 'Add Switch';
      }
    });
  }

  async updateForm() {
    try {
      const deviceSuis = await lastValueFrom(
        this.deviceService.getById<DeviceSuis>(this.id),
      );

      this.fg.patchValue({
        name: deviceSuis.name,
        topic: deviceSuis.suis.topic,
        remark: deviceSuis.remark,
      });

      this.createActions = deviceSuis.suis.actions;
    } catch (error) {
      this._snackBar.open('Cannot load switch data', 'Close', {
        duration: 300,
      });
    }
  }

  initFg() {
    this.fg = this.fb.group({
      name: ['', Validators.required],
      topic: ['', Validators.required],
      remark: [''],
      key: [''],
      value: [''],
    });
  }

  async onSubmit() {
    const name = this.fg.get('name')?.value || '';
    const topic = this.fg.get('topic')?.value || '';
    const remark = this.fg.get('remark')?.value || '';

    if (this.createActions.length === 0) {
      this._notifyError('key value is empty');
      return;
    }

    if (this.id > -1) {
      console.log('update');
      // Update
      try {
        await lastValueFrom(
          this.deviceService.updateSwitchById(this.id, {
            name,
            topic,
            remark,
            action: this.createActions,
          }),
        );

        this._notify('Switch updated successfully');
        this.location.back();
      } catch (error) {
        this._notifyError('Failed to update switch');
      }
    } else {
      // Create new
      try {
        await lastValueFrom(
          this.deviceService.createSwitch({
            name,
            topic,
            remark,
            action: this.createActions,
          }),
        );

        this._notify('Switch created successfully');
        this.location.back();
      } catch (error) {
        this._notifyError('Failed to create switch');
      }
    }
  }

  onCancel() {
    // Back to previous page
    this.location.back();
  }

  addSuis() {
    const key = this.fg.get('key')?.value || '';
    const value = this.fg.get('value')?.value || '';

    this.createActions.push({
      key,
      value,
    });
  }

  onRemoveAction(index: number) {
    this.createActions.splice(index, 1);
  }

  private _notify(msg: string) {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
    });
  }

  private _notifyError(msg: string) {
    this._snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error',
    });
  }
}
