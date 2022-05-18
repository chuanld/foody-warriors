import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

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
  guests$!: Observable<Guest[]>;
  private searchTerms = new Subject<string>();

  constructor(private guestService: GuestService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.guests$ = this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => this.guestService.searchGuests(term))
    );
  }
}
