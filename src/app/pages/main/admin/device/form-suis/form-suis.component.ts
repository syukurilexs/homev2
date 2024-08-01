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
import { DeviceE } from '../../../../../enums/device-type.enum';
import { CreateAction } from '../../../../../types/create-action.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Suis } from '../../../../../types/suis.type';

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
      const suis = await lastValueFrom(
        this.deviceService.getById<Suis>(this.id),
      );

      this.fg.patchValue({
        name: suis.name,
        topic: suis.topic,
        remark: suis.remark,
      });

      this.createActions = suis.action;
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
      this._snackBar.open('Key value is empty', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error',
      });
      return;
    }

    if (this.id > -1) {
      // Update
      console.log('update');
      await lastValueFrom(
        this.deviceService.updateSwitchById(this.id, {
          name,
          topic,
          remark,
          type: DeviceE.Switch,
          action: this.createActions,
        }),
      );

      this._snackBar.open('Switch updated successfully', 'Close', {
        duration: 3000,
      });
    } else {
      // Create new

      await lastValueFrom(
        this.deviceService.createSwitch({
          name,
          topic,
          remark,
          type: DeviceE.Switch,
          action: this.createActions,
        }),
      );

      this._snackBar.open('Switch created successfully', 'Close', {
        duration: 3000,
      });
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
}
