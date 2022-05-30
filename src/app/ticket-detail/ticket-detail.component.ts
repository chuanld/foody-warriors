import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Guest } from '../guest';
import { Food } from '../food';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { GuestService } from '../guest.service';
import { FoodService } from '../food.service';
import { forkJoin } from 'rxjs';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageSysService } from '../message-sys.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css'],
})
export class TicketDetailComponent implements OnInit, OnChanges {
  guest: Guest | undefined;
  foods: Food[] | [];
  formValues: FormGroup;
  listOrderUpdate;

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private guestService: GuestService,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageSysService: MessageSysService
  ) {}

  ngOnInit(): void {
    this.getData();

    // var al = this.guest.order.reduce((order) => {
    //   return order.id;
    // });
    // console.log(this.guest);
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  onSubmit() {}

  //GetData
  getData(): void {
    let foods = this.foodService.getFoods();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    let guest = this.guestService.getGuestById(id);

    forkJoin([foods, guest]).subscribe(([foods, guest]) => {
      this.foods = foods;
      this.guest = guest;
      this.formValues = this.formBuilder.group({
        id: guest.id,
        name: [guest.name, Validators.required],
        order: [
          this.guest.order.map((order) => {
            return order.id;
          }),
          Validators.required,
        ],
      });
      let ar = this.guest.order.map((order) => {
        return order;
      });
      console.log(ar);
    });
  }
  goBack(): void {
    this.location.back();
  }
  save(): void {
    if (!this.formValues.valid) return this.log('Form invalid');
    const infHero = { ...this.formValues.value, id: this.guest.id };
    console.log(infHero);
    this.guestService.updateGuest(infHero).subscribe(() => this.goBack());
    // if (this.guest) {
    //   console.log(this.guest);
    //
    // }
  }
  selectOption(e: any) {
    // this.hero?.ability  = parseInt(e.target.value)
    // // console.log(typeof e.target.value);
  }
  private log(message: string) {
    this.messageSysService.addMess(`form-add-order: ${message}`);
  }
}
