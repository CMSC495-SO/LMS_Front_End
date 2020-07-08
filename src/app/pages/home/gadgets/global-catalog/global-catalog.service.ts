import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class GlobalCatalogService {
  allBookUrl = {
    basePath: 'https://lib-management-backend.herokuapp.com/',
    getBooks: '/books'
  };

  allBooks:object[] = [];

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
