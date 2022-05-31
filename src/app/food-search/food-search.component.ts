import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';

import { Observable, Subject, Subscription } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Food } from '../food';
import { FoodService } from '../food.service';

import { Guest } from '../guest';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-food-search',
  templateUrl: './food-search.component.html',
  styleUrls: ['./food-search.component.css'],
})
export class FoodSearchComponent implements OnInit {
  foods!: Observable<any>;
  isLoading: boolean = false;
  searchTerms = new Subject<string>();
  subscription: Subscription[] = [];
  initValue: string = '';
  @Output() textChange = new EventEmitter<string>();
  textSearch: string;
  @Output() onSearch = new EventEmitter<boolean>();

  constructor(private foodService: FoodService) {}

  trigger = this.searchTerms.pipe();

  ngOnInit(): void {
    // this.foods$ = this.searchTerms.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap((term: string) => this.textChange.emit(term))
    // );
    const subscription = this.trigger.subscribe((currentValue) => {
      this.textChange.emit(currentValue);
    });
    this.subscription.push(subscription);
    console.log('sasd');
  }
  ngOnDestroy() {
    this.subscription.forEach((sub) => sub.unsubscribe());
  }

  onInput(e: any) {
    if (e.target.value.trim() == '') {
      // this.onSearch=false;
      this.onSearch.emit(false);
    } else this.onSearch.emit(true);

    this.textSearch = e.target.value;
  }
  handleSearch(): void {
    this.searchTerms.next(this.textSearch);
  }
}
