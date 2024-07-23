import { Component } from '@angular/core';
import { SceneComponent } from './scene/scene.component';
import { GroupComponent } from './group/group.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SceneComponent,GroupComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
