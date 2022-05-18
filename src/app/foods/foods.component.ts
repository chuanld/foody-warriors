import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from '../food';
import { FoodService } from '../food.service';
import { Guest } from '../guest';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
})
export class FoodsComponent implements OnInit {
  guests: Guest[] = [];
  foods: Food[] = [];
  food: Food;

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

  delete(food: Food): void {
    let checkGuest = this.guests.filter(
      (guest) => guest.order == food.id || guest.subOrder == food.id
    );
    if (checkGuest.length > 0) {
      console.log(checkGuest);
      let msg =
        checkGuest.map((g) => ` ${g.name}`) +
        ' ordered this food. Please remove ticket of them first.';
      window.alert(msg);
      return;
    }
    this.foods = this.foods.filter((h) => h !== food);
    this.foodService.deleteFood(food.id).subscribe();
    localStorage.setItem(
      'foods',
      JSON.stringify(
        this.foodService.getFoods().subscribe((foods) => (this.foods = foods))
      )
    );
  }

  clickEditSubmit(food: Food) {
    this.foodService.updateFood(food).subscribe(() => this.getData());
  }
  clickSubmit(newFood: Food) {
    this.foodService.addFood(newFood).subscribe((food) => {
      this.foods.push(food);
    });
    this.getData();
  }
  onSelectFood(foodSelect: Food) {
    this.food = foodSelect;
  }
}
