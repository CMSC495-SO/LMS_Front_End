import {Injectable, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {EventEmitter} from '@angular/core';

import {StorageManager} from '../../tools/storageManager';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  [x: string]: any;
  allLoginUrl = {
    basePath: environment.baseUrl,
    /*basePath: 'https://lib-management-backend.herokuapp.com/lib/library',*/
    findUser: '/users/checkUser',
    loginUrl: '/login',
    signUp: '/users'
  };

  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  user: object = null;
  /*options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | string[]},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  }*/
  constructor(private http: HttpClient) {
  }

  checkUserNameValid(userNameParams) {
    return this.http.get(this.allLoginUrl.basePath + this.allLoginUrl.findUser, {params: userNameParams});
  }

  loginUser(data: { userName: string; password: string; }) {
    return this.http.post(this.allLoginUrl.basePath + this.allLoginUrl.loginUrl, {params: data});
  }

  signUp(data){
    return this.http.post(this.allLoginUrl.basePath + this.allLoginUrl.signUp, {params: data});
  }

  logoutUser() {
    this.setUserData(null);
    const store = new StorageManager({});
    store.removeStorageItem('userdata');
    this.loggedIn.emit(null);
  }

  setUserData(data) {
    this.user = data;
  }

  getUserData() {
    return this.user;
  }

  isUserLoggedIn() {
    return !!this.user;
  }

  /*todo: Future use*/
  handleError(response) {
    if (response.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', response.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${response.status}, ` +
        `body was: ${response.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
