import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Group } from '../types/group.type';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Group[]>(this.url + '/group');
  }

  create(value: Partial<{ name: any; devices: any }>) {
    return this.http.post(this.url + '/group', value);
  }

  deleteById(id: number) {
    return this.http.delete(this.url + '/group/' + id);
  }

  getById(id: number) {
    return this.http.get<Group>(this.url + '/group/' + id);
  }

  updateById(id: number, value: Partial<{name: any, devices: any}>) {
    return this.http.patch(this.url + '/group/' + id, value);
  }
}
