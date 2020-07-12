import {Injectable, Output} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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
    signUp: '/users',
    getAllUsers: '/users/fetchUsers',
    updateUser: '/users/updateUser',
    removeUser: '/users/'
  };

  @Output() loggedIn: EventEmitter<any> = new EventEmitter();

  user: any = null;
  /*options: {
    headers?: HttpHeaders | {[header: string]: string | string[]},
    observe?: 'body' | 'events' | 'response',
    params?: HttpParams|{[param: string]: string | string[]},
    reportProgress?: boolean,
    responseType?: 'arraybuffer'|'blob'|'json'|'text',
    withCredentials?: boolean,
  }*/
  constructor(private http: HttpClient) {
    this.setUserData();
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
    const store = new StorageManager({});
    store.removeStorageItem('userdata');
    this.setUserData();
    this.loggedIn.emit(null);
  }

  updateUser(params) {
    params.updatedBy = this.user.id;

    return this.http.put(this.allLoginUrl.basePath + this.allLoginUrl.updateUser, params);
  }

  deleteUser(params) {
    const httpParams = new HttpParams().set('id', params.itemId);

    const options = { params: httpParams };

    params.userId = this.user.id;

    return this.http.delete(this.allLoginUrl.basePath + this.allLoginUrl.removeUser);
  }

  setUserData() {
    this.user = this.getUserData();
  }

  getUserData() {
    const store = new StorageManager({});

    return store.getStorageItem('userdata') ? JSON.parse(store.getStorageItem('userdata')) : null;
  }

  isUserLoggedIn() {
    return !!this.user;
  }

  getAllUsers() {
    return this.http.post(this.allLoginUrl.basePath + this.allLoginUrl.getAllUsers, {params: {userId: this.user.id}});
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
