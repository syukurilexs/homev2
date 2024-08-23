import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DeviceE } from '../enums/device-type.enum';
import { environment } from '../../environments/environment';
import { StateE } from '../enums/state.enum';
import { CreateSuis } from '../types/create-suis.type';
import { CreateRpi } from '../types/create-rpi.type';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  url = environment.apiUrl + '/device';
  isBrowser: boolean | undefined;

  constructor(private http: HttpClient) {}

  getAll<T>() {
    return this.http.get<T>(this.url + '').pipe(catchError(this.handleError));
  }

  getAllByType<T>(type: DeviceE) {
    return this.http
      .get<T>(this.url + '?type=' + type)
      .pipe(catchError(this.handleError));
  }

  getAllAction<T>() {
    return this.http
      .get<T[]>(this.url + '/action')
      .pipe(catchError(this.handleError));
  }

  createLight(value: Partial<{ name: any; type: any }>) {
    return this.http
      .post(this.url + '/light', value)
      .pipe(catchError(this.handleError));
  }

  createFan(value: Partial<{ name: any; type: any }>) {
    return this.http
      .post(this.url + '/fan', value)
      .pipe(catchError(this.handleError));
  }

  create(value: Partial<{ name: any; type: any }>) {
    return this.http
      .post(this.url + '', value)
      .pipe(catchError(this.handleError));
  }

  createSwitch(value: CreateSuis) {
    return this.http
      .post(this.url + '/switch', value)
      .pipe(catchError(this.handleError));
  }

  createContact(value: Partial<{ name: any; type: any }>) {
    return this.http
      .post(this.url + '/contactsensor', value)
      .pipe(catchError(this.handleError));
  }

  createRpi(input: CreateRpi) {
    return this.http.post(this.url + '/rpi', input);
  }

  deleteById(id: number) {
    return this.http
      .delete(this.url + '/' + id)
      .pipe(catchError(this.handleError));
  }

  getById<T>(id: number) {
    return this.http
      .get<T>(this.url + '/' + id)
      .pipe(catchError(this.handleError));
  }

  updateLightById(id: number, value: any) {
    return this.http
      .patch(this.url + '/light/' + id, value)
      .pipe(catchError(this.handleError));
  }

  updateFanById(id: number, value: any) {
    return this.http
      .patch(this.url + '/fan/' + id, value)
      .pipe(catchError(this.handleError));
  }

  updateById(id: number, value: any) {
    return this.http
      .patch(this.url + '/' + id, value)
      .pipe(catchError(this.handleError));
  }

  updateSwitchById(id: number, value: CreateSuis) {
    return this.http
      .patch(this.url + '/switch/' + id, value)
      .pipe(catchError(this.handleError));
  }

  updateContactById(id: number, value: Partial<{ name: any; type: any }>) {
    return this.http
      .patch(this.url + '/contactsensor' + id, value)
      .pipe(catchError(this.handleError));
  }

  updateRpiById(id: number, input: CreateRpi) {
    return this.http.patch(this.url + '/rpi/' + id, input);
  }

  updateState(id: number, state: StateE) {
    return this.http
      .patch(this.url + '/' + id + '/state', { state })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error,
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.'),
    );
  }
}
