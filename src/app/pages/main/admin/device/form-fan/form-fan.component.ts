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
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { last, lastValueFrom, Observable } from 'rxjs';
import { DeviceService } from '../../../../../services/device.service';
import { DeviceE } from '../../../../../enums/device-type.enum';
import { AsyncPipe, Location } from '@angular/common';
import { Action } from '../../../../../types/action.type';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fan } from '../../../../../types/fan.type';

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
  suis$!: Observable<any[]>;
  actions: Action[] = [];
  selectedActions: Action[] = [];
  id = -1;

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

  initObservable() {
    this.suis$ = this.deviceService.getAllByType(DeviceE.Switch);
  }

  initFg() {
    this.fg = this.fb.group({
      name: ['', Validators.required],
      mqttTopic: ['', Validators.required],
      remark: [''],
      suis: [''],
      action: [''],
    });

    this.fg.get('suis')?.valueChanges.subscribe((x) => {
      this.actions = x.action;
    });
  }

  async updateForm() {
    try {
      const device = await lastValueFrom(
        this.deviceService.getById<Fan>(this.id),
      );

      // Update form
      this.fg.patchValue({
        name: device.name,
        mqttTopic: device.topic,
        remark: device.remark,
      });

      // Update selected action
      this.selectedActions = device.selectedAction;
    } catch (error) {
      this._snackBar.open('Failed to load fan', 'Close', { duration: 3000 });
    }
  }

  getRouteParam() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id') !== null) {
        this.id = (params.get('id') as any) || -1;

        // Updating form with information from server
        this.updateForm();

        // Change subtitle
        this.title = 'Update Fan';
      }
    });
  }

  async onSubmit() {
    if (this.id > 0) {
      const input = {
        type: DeviceE.Fan,
        actions: this.selectedActions.map((x) => x.id),
        name: this.fg.get('name')?.value,
        topic: this.fg.get('mqttTopic')?.value,
        remark: this.fg.get('remark')?.value,
      };

      try {
        await lastValueFrom(this.deviceService.updateById(this.id, input));
        this._snackBar.open('Successfully updating fan', 'close', {
          duration: 3000,
        });
        this.location.back();
      } catch (error) {
        this._snackBar.open('Failed to update fan', 'close', {
          duration: 3000,
        });
      }
    } else {
      const input = {
        type: 1,
        actions: this.selectedActions.map((x) => x.id),
        name: this.fg.get('name')?.value,
        topic: this.fg.get('mqttTopic')?.value,
        remark: this.fg.get('remark')?.value,
      };

      try {
        await lastValueFrom(this.deviceService.create(input));
        this._snackBar.open('Successfully creating new fan', 'close', {
          duration: 3000,
        });
        this.location.back();
      } catch (error) {
        this._snackBar.open('Failed to create new fan', 'close', {
          duration: 3000,
        });
      }
    }
  }

  onAddSuisAction() {
    const suis = this.fg.get('suis')?.value;
    const action = this.fg.get('action')?.value;

    this.selectedActions.push({
      id: action.id,
      key: action.key,
      value: action.value,
      name: suis.name,
    });
  }

  back() {
    this.location.back();
  }

  onRemoveAction(action: Action) {
    const index = this.selectedActions.findIndex((x) => x.id === action.id);

    if (index > -1) {
      this.selectedActions.splice(index, 1);
    }
  }
}
