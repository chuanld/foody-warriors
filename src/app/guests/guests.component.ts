import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from '../food';
import { FoodService } from '../food.service';
import { Guest } from '../guest';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css'],
})
export class GuestsComponent implements OnInit {
  guests: Guest[] = [];
  foods: Food[] = [];

  constructor(
    private guestService: GuestService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  //GetData
  getData(): void {
    let foods = this.foodService.getFoods();
    let guests = this.guestService.getGuestsData();

    forkJoin([foods, guests]).subscribe(([foods, guests]) => {
      this.foods = foods;
      localStorage.setItem('foods', JSON.stringify(foods));
      this.guests = guests;
      localStorage.setItem('guests', JSON.stringify(guests));
    });
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
    this.guests = this.guests.filter((h) => h !== guest);
    this.guestService.deleteGuest(guest.id).subscribe();
    localStorage.setItem(
      'heroes',
      JSON.stringify(
        this.guestService
          .getGuestsData()
          .subscribe((guests) => (this.guests = guests))
      )
    );
  }

  //submit
  clickSubmit(newGuest: Guest) {
    this.guestService.addGuest(newGuest).subscribe((guest) => {
      this.guests.push(guest);
    });
    this.getData();
  }
}
