import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Food } from '../food';
import { FoodService } from '../food.service';

import { GuestService } from '../guest.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  foods: Food[] = [];
  @Output() isSelect = new EventEmitter<number>();
  isLoading: boolean = false;

  constructor(
    private guestService: GuestService,
    private foodService: FoodService
  ) {}

  ngOnInit(): void {
    this.getFoods();
  }
  getFoods(): void {
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
}
