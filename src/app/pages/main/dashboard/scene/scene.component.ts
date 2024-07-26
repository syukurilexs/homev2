import { Component } from '@angular/core';
import { SceneService } from '../../../../services/scene.service';
import {
  lastValueFrom,
  map,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import { Scene } from '../../../../types/scene.type';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatRipple,
    MatFabButton,
    MatIcon,
    AsyncPipe,
    TitleCasePipe,
    NgClass,
  ],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss',
})
export class SceneComponent {
  scenes$!: Observable<Scene[]>;
  isHandset$!: Observable<boolean>;

  destroyed = new Subject<void>();

  constructor(
    private sceneService: SceneService,
    private breakpointObserver: BreakpointObserver,
    private _snackBar: MatSnackBar,
  ) {
    this.initObservable();
  }

  initObservable() {
    this.scenes$ = this.sceneService.getAll();
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
      takeUntil(this.destroyed),
    );
  }

  async onClicked(scene: Scene) {
    try {
      await lastValueFrom(this.sceneService.triggerScene(scene));
    } catch (error) {
      this._snackBar.open('Failed to activate scene', 'Close', {
        duration: 2000,
      });
    }
  }
}
