import { Component } from '@angular/core';
import { EditListComponent } from '../../../../components/edit-list/edit-list.component';
import { Group } from '../../../../types/group.type';
import { GroupService } from '../../../../services/group.service';
import { first, lastValueFrom } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [EditListComponent, MatIconModule, MatButtonModule, MatCardModule],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss',
})
export class GroupComponent {
  groups: Group[] = [];
  currentGroup: Group | undefined = undefined;
  id = -1;

  constructor(
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) {
    this.reload();
  }

  reload() {
    this.groupService
      .getAll()
      .pipe(first())
      .subscribe((x) => (this.groups = x));
  }

  onEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onInfo(id: number) {
    this.currentGroup = this.groups.find((x) => x.id === id);
  }

  async onRemove(id: number) {
    try {
      await lastValueFrom(this.groupService.deleteById(id));
      this.notify('Group deleted successfully');
      this.reload();
    } catch (error) {
      this.notifyError('Failed to delete group');
    }
  }

  onCreate() {
    this.router.navigate(['create'], { relativeTo: this.route });
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
