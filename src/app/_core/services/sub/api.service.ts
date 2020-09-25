// tslint:disable-next-line:no-submodule-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
// tslint:disable-next-line:no-submodule-imports
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

const BASE_URL = environment.serverUrl;
const MOCK_URL = environment.mockUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private httpOptions = {
    withCredentials: true
  };

  constructor(
    private httpClient: HttpClient
  ) {}


  public post2(url: string, data): void {
    const http$ = this.httpClient.post(`${BASE_URL}${url}`, data);

    http$
      .pipe(
        map(res => res['payload']),
        catchError(err => {
          console.log('caught mapping error and rethrowing', err.status);
          return throwError(err);
        }),
        catchError(err => {
          console.log('caught rethrown error, providing fallback value', err);
          return of([]);
        })
      )
      .subscribe(
        res => console.log('HTTP response', res),
      //  err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      );
  }
  public post(url: string, data): Observable<any> {
    return this.httpClient
      .post(`${BASE_URL}${url}`, data, this.httpOptions)
      .pipe(map(res => {
        return res;
      }), catchError(err => {
        return this.handleError(err);
      }));
  }

  public get(url: string): Observable<any> {
    return this.httpClient
      .get(`${BASE_URL}${url}`, this.httpOptions)
      .pipe(map(data => {
        return data;
      }), catchError(err => {
        return this.handleError(err);
      }));
  }

  public put(url: string, data): Observable<any> {
    return this.httpClient
      .put(`${BASE_URL}${url}`, data, this.httpOptions)
      .pipe(map(res => {
        return res;
      }), catchError(err => {
        return this.handleError(err);
      }));
  }

  public delete(url: string): Observable<any> {
    return this.httpClient
      .delete(`${BASE_URL}${url}`, this.httpOptions)
      .pipe(map(data => {
        return data;
      }), catchError(err => {
        return this.handleError(err);
      }));
  }

  public getFromJSON(url: string): Observable<any> {
    return this.httpClient.get(`${MOCK_URL}${url}.json`);
  }

  private handleError(error: any): Observable<any> {
    if (error.status === 401) {
      // location.reload();
      alert('401');
    } else if (error.status === 409){
       alert('409');
    } else {
      return throwError(error);
    }
  }
}
