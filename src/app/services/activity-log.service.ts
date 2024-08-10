import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivityLogService {
  url = environment.apiUrl + '/activitylog';

  constructor(private http: HttpClient) {}

  getActivityLog(page: number, take: number = 10) {
    return this.http.get(this.url + `?order=DESC&page=${page}&take=${take}`);
  }

  clear() {
    return this.http.get(this.url + '/clear');
  }
}
