import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Food } from '../food';
import { FoodService } from '../food.service';
import { Guest } from '../guest';
import { GuestService } from '../guest.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

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
    private foodService: FoodService,
    public dialog: MatDialog
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
  delete(guest: Guest): void {
    // this.guests = this.guests.filter((h) => h !== guest);
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: {
        title: 'Delete Confirm',
        message: `Are you sure  delete ${guest.name} id: ${guest.id}`,
        item: guest,
        buttonYes: 'Yes',
        buttonCancel: 'Cancel',
      },
    });
    dialogRef.afterClosed().subscribe((guest) => {
      if (!guest) return;
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
    });
  }

  //submit
  clickSubmit(newGuest: Guest) {
    this.subscription = this.guestService.addGuest(newGuest).subscribe();
    this.getData();
    // console.log(newGuest);
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
