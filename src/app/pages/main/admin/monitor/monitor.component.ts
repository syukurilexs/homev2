import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  catchError,
  first,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Job } from '../../../../types/job.type';
import { TimerService } from '../../../../services/timer.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { ActivityLogService } from '../../../../services/activity-log.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    MatTabsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.scss',
})
export class MonitorComponent implements AfterViewInit {
  // Timer tab
  jobs$!: Observable<Job[]>;

  // Logging tab
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoadingResults = true;
  resultsLength = 0;
  data: any[] = [];
  pageSize = 10;
  pageEvent!: PageEvent;

  constructor(
    private timerService: TimerService,
    private activityLogService: ActivityLogService,
    private snackBar: MatSnackBar,
  ) {
    this.initObservable();
  }

  ngAfterViewInit() {
    this.subscribeToData();
  }

  initObservable() {
    this.jobs$ = this.timerService.getJobs();
  }

  /**
   * To update the page size
   * @date 3/30/2024 - 11:17:03 AM
   *
   * @param {PageEvent} e
   */
  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
  }

  /**
   * Fetching data realtime from server and display by page
   * @date 3/30/2024 - 11:16:30 AM
   */
  subscribeToData() {
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.activityLogService
            .getActivityLog(this.paginator.pageIndex + 1, this.pageSize)
            .pipe(catchError(() => of(null)));
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.meta.itemCount;
          return data.data;
        }),
      )
      .subscribe((data) => {
        this.data = data;
      });
  }

  onClearLog() {
    this.activityLogService
      .clear()
      .pipe(first())
      .subscribe({
        next: () => {
          this.data = [];
        },
        error: (err) => {
          this._notifyError('Failed to clear log');
          console.error(err);
        },
      });
  }

  private _notifyError(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000,
      panelClass: 'snackbar-error',
    });
  }
}
