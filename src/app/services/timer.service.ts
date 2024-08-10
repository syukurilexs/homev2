import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Job } from '../types/job.type';
import { CreateTimer } from '../types/create-timer.type';
import { Timer } from '../types/timer.type';
import { UpdateTimer } from '../types/update-timer.type';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  url = environment.apiUrl + '/timer';

  constructor(private http: HttpClient) {}

  getJobs() {
    return this.http.get<Job[]>(this.url + '/jobs');
  }

  deleteById(id: number) {
    return this.http.delete(this.url + '/' + id);
  }

  getAll<T>() {
    console.log('panggil');
    return this.http.get<T[]>(this.url);
  }

  getById<T>(id: number) {
    return this.http.get<T>(this.url + '/' + id);
  }

  create(data: CreateTimer) {
    return this.http.post(this.url + '/', data);
  }

  updateById(data: UpdateTimer, id: number) {
    return this.http.patch(this.url + '/' + id, data);
  }

  enableOption(timer: Timer) {
    return this.http.patch(this.url + '/' + timer.id + '/option', {
      option: timer.option,
    });
  }
}
