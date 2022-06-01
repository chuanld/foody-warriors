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
import { ActivatedRoute } from '@angular/router';

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
  id: number = 0;
  //dialog
  title: string;
  message: string;

  constructor(
    private guestService: GuestService,
    private foodService: FoodService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id > 0) {
      this.foodService
        .getFoodById(this.id)
        .subscribe((food) => (this.food = food));
    }
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
      foods.forEach((food, idx) => {
        if (food.id === this.id) {
          this.activeIndex = idx;
        }
      });
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
    const foodTerm = this.food || null;
    const ixdAcTerm = this.activeIndex || -1;
    this.isLoading = true;
    if (foodDel.id === this.food?.id) {
      this.onSelectFood(null, -1);
      this.foods = this.foods.filter((h) => h !== foodDel);
      this.foodService.deleteFood(foodDel.id).subscribe(() => {
        this.getData();
        this.dialog.open(ModalComponent, {
          width: '350px',
          data: {
            title: 'Delete Food',
            message: `Delete ${foodDel.name} success`,
            buttonOK: 'OK',
          },
        });
      });
      return;
    }
    if (foodDel.id < this.food?.id) {
      this.foods = this.foods.filter((h) => h !== foodDel);
      this.foodService.deleteFood(foodDel.id).subscribe(() => {
        this.getData();
        console.log('asdd');
        this.dialog.open(ModalComponent, {
          width: '350px',
          data: {
            title: 'Delete Food',
            message: `Delete ${foodDel.name} success`,
            buttonOK: 'OK',
          },
        });
        this.onSelectFood(foodTerm, ixdAcTerm - 1);
      });
      return;
    }
    this.foods = this.foods.filter((h) => h !== foodDel);
    this.foodService.deleteFood(foodDel.id).subscribe(() => {
      this.getData();
      console.log('asdd');
      this.dialog.open(ModalComponent, {
        width: '350px',
        data: {
          title: 'Delete Food',
          message: `Delete ${foodDel.name} success`,
          buttonOK: 'OK',
        },
      });
      this.onSelectFood(foodTerm, ixdAcTerm);
    });
  }

  clickEditSubmit(food: Food) {
    console.log(food);
    this.foodService.updateFood(food).subscribe(() => {
      this.dialog.open(ModalComponent, {
        width: '350px',
        data: {
          title: 'Edit Food',
          message: `Update success ${food.name}`,
          buttonOK: 'OK',
        },
      });
      this.getData();
    });
  }
  clickSubmit(newFoods) {
    if (!newFoods) return;
    // console.log(newFoods);
    const regExp = new RegExp(
      '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW0-9|_ -]+$'
    );
    let foodSuccess = [];
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
        foodSuccess.push(data);
        this.foodService.addFood(data).subscribe((food) => {
          this.foods.unshift(food);
        });
      }
    });
    console.log(foodSuccess);
    let msg = foodSuccess.map((g) => ` ${g.name}`) + ' has been created.';
    this.dialog.open(ModalComponent, {
      width: '350px',
      data: {
        title: 'Edit Food',
        message: msg,
        buttonOK: 'OK',
      },
    });
    this.saveLocal();
    // this.getData();
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
    this.message = `Are you sure  delete ${food.name} ?`;
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
  saveLocal() {
    this.foodService.getFoods().subscribe((foods) => {
      localStorage.setItem('foods', JSON.stringify(foods));
    });
  }
}
