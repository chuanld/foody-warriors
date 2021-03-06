import { Injectable } from '@angular/core';
import { Food } from './food';
import { Observable, of } from 'rxjs';
import { MessageSysService } from './message-sys.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class FoodService {
  httpOptions = {
    // headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(
    private http: HttpClient,
    private messageSysService: MessageSysService
  ) {}

  private foodsUrl = 'api/storedFoods'; // URL to web api
  getTestFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.foodsUrl);
    // .subscribe((data) => console.log(data, 'data'));
  }
  getFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(this.foodsUrl).pipe(
      tap((foods) => {
        this.log(`fetched (${foods.length}) foods`);
        this.saveLocalStorage(foods);
      }),
      catchError(this.handleError<Food[]>('get-foods', []))
    );
  }
  getFoodById(id: number): Observable<Food> {
    const url = `${this.foodsUrl}/${id}`;
    return this.http.get<Food>(url).pipe(
      tap((food) => this.log(`fetched food id=${food.id}`)),
      catchError(this.handleError<Food>(`get-foodById id=${id}`))
    );
  }
  addFood(food: any): Observable<any> {
    return this.http.post<any>(this.foodsUrl, food, this.httpOptions).pipe(
      tap((newFood: Food) =>
        this.log(`Add food:${newFood.name ? newFood.name : newFood}`)
      ),
      catchError(this.handleError<Food>('add-food'))
    );
  }
  updateFood(food: Food): Observable<any> {
    return this.http.put(this.foodsUrl, food, this.httpOptions).pipe(
      tap((_) => this.log(`Update food id=${food.id}`)),
      catchError(this.handleError<any>('update-food'))
    );
  }
  deleteFood(id: number): Observable<Food> {
    const url = `${this.foodsUrl}/${id}`;

    return this.http.delete<Food>(url, this.httpOptions).pipe(
      tap((_) => this.log(`Deleted food id: ${id}`)),
      catchError(this.handleError<Food>('delete-food'))
    );
  }

  //search
  //search$
  searchFoods(term: string): Observable<Food[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Food[]>(`${this.foodsUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`Found food matching "${term}"`)
          : this.log(`No food matching "${term}"`)
      ),
      catchError(this.handleError<Food[]>('search-food', []))
    );
  }

  private log(message: string) {
    this.messageSysService.addMess(`FoodService: ${message}`);
  }
  private saveLocalStorage(foods) {
    localStorage.setItem('foods', JSON.stringify(foods));
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
