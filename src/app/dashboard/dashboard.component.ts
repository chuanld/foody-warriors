import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Food } from '../food';
import { FoodService } from '../food.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  foods: any;
  @Output() isSelect = new EventEmitter<number>();
  isLoading: boolean = false;
  searchTerm = new Subject<string>();
  @Output() textSearchInput: string = '';
  onSearching: boolean = false;

  results$: Observable<any> = this.searchTerm.pipe(
    switchMap((searchTerm) => {
      if (!this.onSearching) {
        this.getFoods();
        return this.foodService.searchFoods(searchTerm.trim());
      }
      const regularExp = new RegExp(
        '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW|_ ]+$'
      );
      // if (!regularExp.test(searchTerm.trim())) {
      //   this.popupErr('Search Food', 'please do not type special character');
      //   this.getFoods();
      //   return null;
      // }
      if (
        searchTerm.trim().length == 0 ||
        !searchTerm ||
        searchTerm.trim() == ''
      ) {
        this.getFoods();
        return this.foodService.searchFoods(searchTerm.trim());
      }

      return this.foodService.searchFoods(searchTerm.trim()).pipe(
        map((data) => {
          if (data.length === 0 || !regularExp.test(searchTerm.trim())) {
            this.popupErr('Search Food', 'Oops..., food not found');
            this.getFoods();
            return null;
          }
          this.foods = [];
          return data;
        })
      );
    })
  );

  popupErr(title: string, message: string) {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: { title: title, message: message, buttonOK: 'Got it' },
    });
    // dialogRef.afterClosed().subscribe((food) => {
    //   if (!food) return;
    //   this.delete(food);
    // });
    // window.alert(title + message);
  }

  constructor(private foodService: FoodService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getFoods();

    // this.results$ = this.foodService.getFoods();
  }
  getFoods() {
    this.isLoading = true;
    this.foodService.getFoods().subscribe((foods) => {
      this.foods = foods;

      this.isLoading = false;
    });
  }
  onClickFood(id: number): void {
    if (!id) return;
    this.isSelect.emit(id);
  }

  onTextChange(changedText: string) {
    this.searchTerm.next(changedText);
    console.log(this.textSearchInput);
  }
  onSearchForm(boolOnSearch: boolean) {
    this.onSearching = boolOnSearch;
  }
}
