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
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';

import { GuestService } from '../guest.service';
import { FoodService } from '../food.service';
import { forkJoin } from 'rxjs';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageSysService } from '../message-sys.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ModalComponent } from '../modal/modal.component';

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
  isHideEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private foodService: FoodService,
    private guestService: GuestService,
    private location: Location,
    private formBuilder: FormBuilder,
    private messageSysService: MessageSysService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
    if (this.route.snapshot.url[0].path === 'ticket-detail') {
      this.isHideEdit = true;
    } else this.isHideEdit = false;

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
    console.log(this.route.snapshot.url[0]);
    let guest = this.guestService.getGuestById(id);

    forkJoin([foods, guest]).subscribe(([foods, guest]) => {
      this.foods = foods;
      this.guest = guest;
      this.formValues = this.formBuilder.group({
        id: guest.id,
        name: [
          guest.name,
          [
            Validators.pattern(
              '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW0-9|_ -]+$'
            ),
            Validators.required,
          ],
        ],
        order: [
          // [1, 2],
          this.guest.order.map((order) => {
            return order;
          }),
          Validators.required,
        ],
      });
    });
  }
  goBack(): void {
    this.location.back();
  }
  save(): void {
    if (!this.formValues.valid) return this.log('Form invalid');
    const infHero = { ...this.formValues.value, id: this.guest.id };
    this.guestService.updateGuest(infHero).subscribe(() => {
      this.dialog.open(ModalComponent, {
        width: '350px',
        data: {
          title: 'Edit Ticket',
          message: 'Ticket update success',
          buttonOK: 'OK',
        },
      });
    });
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
