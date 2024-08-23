import { Component } from '@angular/core';
import { EditListComponent } from '../../../../components/edit-list/edit-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Scene } from '../../../../types/scene.type';
import { SceneService } from '../../../../services/scene.service';
import { first, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [
    EditListComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    JsonPipe,
  ],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
})
export class SceneComponent {
  scenes: Scene[] = [];
  scene: Scene | undefined;

  constructor(
    private sceneService: SceneService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.loadScene();
  }

  loadScene() {
    this.sceneService
      .getAll()
      .pipe(first())
      .subscribe((x) => {
        this.scenes = x;
      });
  }

  onEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onInfo(id: number) {
    this.scene = this.scenes.find((x) => x.id === id);
  }

  async onRemove(id: number) {
    try {
      await lastValueFrom(this.sceneService.deleteById(id));
      this._notify('Scene deleted successfully');
      this.loadScene();
    } catch (error) {
      this._notifyError('Failed to delete scene');
    }
  }

  onAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
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
