import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Scene } from '../types/scene.type';
import { CreateScene } from '../types/create-scene.type';

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  updateById(id: number, data: CreateScene) {
    return this.http.patch(this.url + '/scene/' + id, data);
  }

  getById(id: number) {
    return this.http.get<Scene>(this.url + '/scene/' + id);
  }

  getAll() {
    return this.http.get<Scene[]>(this.url + '/scene');
  }

  create(scene: CreateScene) {
    return this.http.post(this.url + '/scene', scene);
  }

  deleteById(id: number) {
    return this.http.delete(this.url + '/scene/' + id);
  }

  triggerScene(scene: Scene) {
    return this.http.put(this.url + '/scene/' + scene.id + '/trigger', {});
  }
}
