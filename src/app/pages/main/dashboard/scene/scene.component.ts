import { Component } from '@angular/core';
import { SceneService } from '../../../../services/scene.service';
import { Observable } from 'rxjs';
import { Scene } from '../../../../types/scene.type';

@Component({
  selector: 'app-scene',
  standalone: true,
  imports: [],
  templateUrl: './scene.component.html',
  styleUrl: './scene.component.scss'
})
export class SceneComponent {
  scene$!: Observable<Scene>;

  constructor(private sceneService: SceneService) {}
}
