import { Injectable } from '@angular/core';
import { Guest } from './guest';
import { Observable, of } from 'rxjs';
import { MessageSysService } from './message-sys.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GuestService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageSysService: MessageSysService
  ) {}
  private guestsUrl = 'api/storedGuests'; // URL to web api

  //search$
  searchGuests(term: string): Observable<Guest[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Guest[]>(`${this.guestsUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found heroes matching "${term}"`)
          : this.log(`No heroes matching "${term}"`)
      ),
      catchError(this.handleError<Guest[]>('search-hero', []))
    );
  }

  //CRUD
  getGuestsData(): Observable<Guest[]> {
    return this.http.get<Guest[]>(this.guestsUrl).pipe(
      tap((guests) => {
        this.log(`fetched (${guests.length}) guests`);
        this.saveLocalStorage(guests);
      }),
      catchError(this.handleError<Guest[]>('get-guests', []))
    );
  }
  getGuestById(id: number): Observable<Guest> {
    const url = `${this.guestsUrl}/${id}`;
    return this.http.get<Guest>(url).pipe(
      tap((guest) => this.log(`fetched guest id=${guest.id}`)),
      catchError(this.handleError<Guest>(`get-guestById id=${id}`))
    );
  }
  addGuest(guest: Guest): Observable<Guest> {
    return this.http.post<Guest>(this.guestsUrl, guest, this.httpOptions).pipe(
      tap((newGuest: Guest) => this.log(`added hero w/ id=${newGuest.id}`)),
      catchError(this.handleError<Guest>('add-guest'))
    );
  }
  updateGuest(guest: Guest): Observable<any> {
    return this.http.put(this.guestsUrl, guest, this.httpOptions).pipe(
      tap((_) => this.log(`updated guest id=${guest.id}`)),
      catchError(this.handleError<any>('update-guest'))
    );
  }
  deleteGuest(id: number): Observable<Guest> {
    const url = `${this.guestsUrl}/${id}`;

    return this.http.delete<Guest>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted guest id=${id}`)),
      catchError(this.handleError<Guest>('deleted-guest'))
    );
  }

  //Func Sys
  private log(message: string) {
    this.messageSysService.addMess(`HeroService: ${message}`);
  }
  private saveLocalStorage(heroes) {
    localStorage.setItem('heroes', JSON.stringify(heroes));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
