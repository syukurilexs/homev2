import { Component, OnInit } from '@angular/core';
import { DeviceTimer } from '../../../../types/device-timer.type';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  BehaviorSubject,
  first,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { TimerService } from '../../../../services/timer.service';
import { AsyncPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { Timer } from '../../../../types/timer.type';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StateE } from '../../../../enums/state.enum';
import { OptionE } from '../../../../enums/option.enum';
import { UpdateTimer } from '../../../../types/update-timer.type';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    AsyncPipe,
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnInit {
  deviceTimer$!: Observable<DeviceTimer[]>;
  refreshDeviceTimer$ = new BehaviorSubject<boolean>(true);
  state = StateE; // This to allow enum being recognize in template
  option = OptionE; // This to allow enum being recognize in template

  constructor(
    private timerService: TimerService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.initObservable();
  }

  ngOnInit(): void {}

  initObservable() {
    this.deviceTimer$ = this.refreshDeviceTimer$.pipe(
      startWith(),
      switchMap((x) => this.timerService.getAll<DeviceTimer>()),
    );
  }

  onAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onDelete(timer: Timer) {
    this.timerService
      .deleteById(timer.id)
      .pipe(first())
      .subscribe({
        next: (x) => {
          this.refreshDeviceTimer$.next(true);
          this.notify('Timer deleted successfully');
        },
        error: (err) => {
          this.notifyError('Failed to delete timer');
        },
      });
  }

  onEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
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

  onOptionChange(timer: Timer) {
    const input: UpdateTimer = {
      option:
        timer.option === OptionE.Enable ? OptionE.Disable : OptionE.Enable,
    };

    this.timerService
      .updateById(input, timer.id)
      .pipe(first())
      .subscribe({
        next: (x) => {
          this.notify('Update option successfully');
        },
        error: (err) => {
          this.notifyError('Failed to change option');
        },
      });
  }

  onStateChange(timer: Timer) {
    const input: UpdateTimer = {
      state: timer.state === StateE.On ? StateE.Off : StateE.On,
    };

    this.timerService
      .updateById(input, timer.id)
      .pipe(first())
      .subscribe({
        next: (x) => {
          this.notify('Update state successfully');
        },
        error: (err) => {
          this.notifyError('Failed to update state');
        },
      });
  }
}
