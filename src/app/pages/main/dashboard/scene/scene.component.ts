import { Component } from '@angular/core';
import { SceneService } from '../../../../services/scene.service';
import { map, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { Scene } from '../../../../types/scene.type';
import { AsyncPipe, NgClass, TitleCasePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatRipple } from '@angular/material/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatRipple,
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

  onClicked(scene: Scene) {
    
  }
}
