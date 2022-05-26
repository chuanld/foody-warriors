import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Food } from '../food';
import { FoodService } from '../food.service';
import { Guest } from '../guest';
import { GuestService } from '../guest.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-foods',
  templateUrl: './foods.component.html',
  styleUrls: ['./foods.component.css'],
})
export class FoodsComponent implements OnInit {
  guests: Guest[] = [];
  foods: Food[] = [];
  food: Food;
  isLoading: boolean = false;
  @Input() activeIndex = 0;

  //dialog
  title: string;
  message: string;

  constructor(
    private guestService: GuestService,
    private foodService: FoodService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  //GetData
  getData(): void {
    this.isLoading = true;
    let foods = this.foodService.getFoods();
    let guests = this.guestService.getGuestsData();

    forkJoin([foods, guests]).subscribe(([foods, guests]) => {
      this.foods = foods;
      localStorage.setItem('foods', JSON.stringify(foods));
      this.guests = guests;
      localStorage.setItem('guests', JSON.stringify(guests));
      this.isLoading = false;
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
    this.isLoading = true;
    this.foods = this.foods.filter((h) => h !== food);
    this.foodService.deleteFood(food.id).subscribe();
    localStorage.setItem(
      'foods',
      JSON.stringify(
        this.foodService.getFoods().subscribe((foods) => {
          this.foods = foods;
          this.isLoading = false;
        })
      )
    );
  }

  clickEditSubmit(food: Food) {
    console.log(food);
    this.foodService.updateFood(food).subscribe(() => this.getData());
  }
  clickSubmit(newFoods) {
    if (!newFoods) return;
    // console.log(newFoods);
    newFoods.forEach((newFood) => {
      if (newFood.trim() || newFood.trim() != '') {
        const data = {
          name: newFood,
        };
        this.foodService.addFood(data).subscribe((food) => {
          this.foods.push(food);
        });
      }
    });
    this.getData();
    // console.log(newFoods);
    // this.foodService.addFood(newFood).subscribe((food) => {
    //   this.foods.push(food);
    // });
    // this.getData();
  }
  onSelectFood(foodSelect: Food, idx: number) {
    this.food = foodSelect;
    this.activeIndex = idx;
  }
  openDialog(food: Food) {
    this.title = 'Delete Confirm';
    this.message = `Are you sure  delete ${food.name} id: ${food.id}`;
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: { title: 'Delete Confirm', message: this.message, item: food },
    });
    dialogRef.afterClosed().subscribe((food) => {
      if (!food) return;
      this.delete(food);
    });
  }
}
