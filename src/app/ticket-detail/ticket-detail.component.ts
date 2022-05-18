import { Component, OnInit } from '@angular/core';
import { Guest } from '../guest';
import { Food } from '../food';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GuestService } from '../guest.service';
import { FoodService } from '../food.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
})
export class TicketDetailComponent implements OnInit {
  guest: Guest | undefined;
  foods: Food[] | [];

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private guestService: GuestService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  //GetData
  getData(): void {
    let foods = this.foodService.getFoods();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    let guest = this.guestService.getGuestById(id);

    forkJoin([foods, guest]).subscribe(([foods, guest]) => {
      this.foods = foods;
      this.guest = guest;
    });
  }
  goBack(): void {
    this.location.back();
  }
  save(): void {
    if (this.guest) {
      console.log(this.guest);
      this.guestService.updateGuest(this.guest).subscribe(() => this.goBack());
    }
  }
  selectOption(e: any) {
    // this.hero?.ability  = parseInt(e.target.value)
    // // console.log(typeof e.target.value);
  }
}
