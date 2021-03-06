import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GlobalCatalogService {
  allBookUrl = {
    basePath: environment.baseUrl,
    /*basePath: 'https://lib-management-backend.herokuapp.com/lib/library',*/
    getBooks: '/books',
    getUserCatalog: '/getUserReservations',
    checkoutItem: '/book/checkout',
    returnBookItem: '/book/return'
  };

  allBooks: object[] = [];

  /*possible options for get*/

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

  getBooks() {
    return this.http.get(this.allBookUrl.basePath + this.allBookUrl.getBooks);
  }

  setAllBooks(books) {
    if (!this.allBooks) {
      this.allBooks = books;
    }
  }

  checkoutItem(paramData) {
    return this.http.post(this.allBookUrl.basePath + this.allBookUrl.checkoutItem, paramData);
  }

  getCurrentUserCatalog(data) {
    return this.http.get(this.allBookUrl.basePath + this.allBookUrl.getUserCatalog, {params: data});
  }

  returnBook(data) {
    return this.http.post(this.allBookUrl.basePath + this.allBookUrl.returnBookItem, data);
  }

  getAllBooks() {
    return this.allBooks;
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
