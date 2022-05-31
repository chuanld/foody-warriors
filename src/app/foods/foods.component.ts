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
  foodTerm: Food;
  isLoading: boolean = false;
  @Input() activeIndex = -1;

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

  delete(foodDel: Food): void {
    let checkGuest = this.guests.filter(
      (guest) => guest.order == foodDel.id || guest.subOrder == foodDel.id
    );
    if (checkGuest.length > 0) {
      let msg =
        checkGuest.map((g) => ` ${g.name}`) +
        ' ordered this food. Please remove ticket of them first.';
      const dialogRef = this.dialog.open(ModalComponent, {
        width: '350px',
        data: {
          title: 'Delete Food',
          message: msg,
          buttonOK: 'Got it',
        },
      });

      return;
    }
    const foodTerm = this.food;
    const ixdAcTerm = this.activeIndex;
    this.isLoading = true;
    if (foodDel.id === this.food.id) {
      this.onSelectFood(null, -1);
      this.foods = this.foods.filter((h) => h !== foodDel);
      this.foodService.deleteFood(foodDel.id).subscribe(() => {
        this.getData();
      });
      return;
    }

    this.foods = this.foods.filter((h) => h !== foodDel);
    this.foodService.deleteFood(foodDel.id).subscribe(() => {
      this.getData();
      this.onSelectFood(foodTerm, ixdAcTerm);
    });
  }

  clickEditSubmit(food: Food) {
    console.log(food);
    this.foodService.updateFood(food).subscribe(() => this.getData());
  }
  clickSubmit(newFoods) {
    if (!newFoods) return;
    // console.log(newFoods);
    const regExp = new RegExp(
      '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW0-9|_ -]+$'
    );
    newFoods.forEach((newFood) => {
      if (!regExp.test(newFood)) {
        const dialogRef = this.dialog.open(ModalComponent, {
          width: '350px',
          data: {
            title: 'Input Food(s)',
            message: `Food cannot contain special character - Your input ${newFood}`,

            buttonOK: 'Got it',
          },
        });
        return;
      }
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
    console.log(foodSelect, idx);
    this.food = foodSelect;
    this.foodTerm = foodSelect;
    this.activeIndex = idx;
  }
  openDialog(food: Food) {
    this.title = 'Delete Confirm';
    this.message = `Are you sure  delete ${food.name} id: ${food.id}`;
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '350px',
      data: {
        title: 'Delete Confirm',
        message: this.message,
        item: food,
        buttonYes: 'Yes',
        buttonCancel: 'Cancel',
      },
    });
    dialogRef.afterClosed().subscribe((food) => {
      if (!food) return;
      this.delete(food);
    });
  }
}
