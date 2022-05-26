import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Food } from '../food';
import { FoodService } from '../food.service';
import { Guest } from '../guest';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css'],
})
export class GuestsComponent implements OnInit, OnDestroy {
  guests: Guest[] = [];
  foods: Food[] = [];
  subscription: Subscription;
  isLoading: boolean = false;
  activateIndex: number = 0;

  constructor(
    private guestService: GuestService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getFoodTest();
    this.getData();
  }

  //GetData
  getData(): void {
    this.isLoading = true;
    let foods = this.foodService.getFoods();
    let guests = this.guestService.getGuestsData();

    this.subscription = forkJoin([foods, guests]).subscribe(
      ([foods, guests]) => {
        this.foods = foods;
        localStorage.setItem('foods', JSON.stringify(foods));
        this.guests = guests;
        localStorage.setItem('guests', JSON.stringify(guests));
        this.isLoading = false;
      }
    );
  }

  //CRUD
  add(name: string): void {
    // name = name.trim();
    // if (!name) {
    //   return;
    // }
    // this.guestService.({ name } as Hero).subscribe((hero) => {
    //   this.heroes.push(hero);
    // });
  }
  delete(guest: Guest): void {
    // this.guests = this.guests.filter((h) => h !== guest);
    this.isLoading = true;
    this.subscription = this.guestService.deleteGuest(guest.id).subscribe();
    localStorage.setItem(
      'guests',
      JSON.stringify(
        this.guestService.getGuestsData().subscribe((guests) => {
          this.guests = guests;
          this.isLoading = false;
        })
      )
    );
  }

  //submit
  clickSubmit(newGuest: Guest) {
    this.subscription = this.guestService.addGuest(newGuest).subscribe();
    this.getData();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  getFoodTest(): void {
    this.subscription = this.foodService
      .getTestFoods()
      .subscribe((data) => console.log(data));
  }
  onClickRow(idx: number) {
    this.activateIndex = idx;
  }
}
