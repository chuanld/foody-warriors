import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Guest } from '../guest';
import { Food } from '../food';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageSysService } from '../message-sys.service';

import { ActivatedRoute } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.css'],
})
export class GuestFormComponent implements OnInit, OnChanges {
  guest: Guest;
  @Output() isClickSubmit = new EventEmitter<Guest>();
  @Input() foods: Food[];
  id: number | 0;

  listFoodsResult: number[];

  formValues: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    order: [[], Validators.required],
    // subOrder: '',
  });

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageSysService: MessageSysService
  ) {}

  // formValues = this.formBuilder.group({
  //   name: ['', Validators.required],
  //   order: ['', Validators.required],
  //   subOrder: '',
  // });

  onSubmit() {
    if (!this.formValues.valid) return this.log('Form invalid');
    const infHero = this.formValues.value;
    this.isClickSubmit.emit(infHero);
    this.formValues.reset({
      name: '',
      order: [],
      // subOrder: '',
    });
  }
  // showFormControls(form: any) {
  //   return form && form.controls.name && form.controls.name.value;
  // }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id != 0) {
      console.log('params:', this.id);
      this.formValues = this.formBuilder.group({
        name: [
          [],
          [
            Validators.pattern(
              '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW|_ ]+$'
            ),
            Validators.required,
          ],
        ],
        order: [[this.id]],
        // subOrder: '',
      });

      return;
    }
    this.formValues = this.formBuilder.group({
      name: [
        [],
        [
          Validators.pattern(
            '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW|_ ]+$'
          ),
          Validators.required,
        ],
      ],
      order: ['', Validators.required],
      subOrder: '',
    });
    // if (this.id != 0) {
    //   this.formValues. = this.id;
    //   console.log(this.id);
    // }
  }

  private log(message: string) {
    this.messageSysService.addMess(`form-add-order: ${message}`);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
