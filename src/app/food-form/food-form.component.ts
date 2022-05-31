import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Guest } from '../guest';
import { Food } from '../food';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MessageSysService } from '../message-sys.service';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.css'],
})
export class FoodFormComponent implements OnInit, OnChanges {
  @Input() foodIsSelect: Food | any;
  @Output() isClickSubmit = new EventEmitter<any>();
  @Output() isClickEditSubmit = new EventEmitter<Food>();
  @Input() foods: Array<Food>;
  onEdit: boolean;
  formValues: FormGroup;
  formListFoods: FormGroup;
  arrFood: string[] = [];
  // formEditValue: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private messageSysService: MessageSysService
  ) {}

  onSubmit() {
    if (this.onEdit === true) {
      if (!this.formEditValue.valid) return this.log('Form invalid');
      const infFoodEdit = this.formEditValue.value;

      this.isClickEditSubmit.emit(infFoodEdit);
      this.formEditValue.reset();
      this.foodIsSelect = null;
      this.onEdit = false;
      return;
    }
    // if (!this.formValues.valid) return this.log('Form invalid');
    // const infFood = this.formValues.value;
    // this.isClickSubmit.emit(infFood);
    // this.formValues.reset();
    if (!this.formListFoods.valid) return this.log('Form invalid');
    const values = this.formListFoods.value.listFood;
    this.arrFood = values.split(',');
    this.isClickSubmit.emit(this.arrFood);
    this.formListFoods.reset();
  }

  showFormControls(form: any) {
    return form && form.controls.name && form.controls.name.value;
  }

  formEditValue = this.formBuilder.group({
    id: '',
    name: [
      '',
      [
        Validators.pattern(
          '^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW|_ 0-9]+$'
        ),
        Validators.required,
      ],
    ],
  });
  ngOnInit(): void {
    this.formValues = this.formBuilder.group({
      name: ['', [Validators.required]],
      // order: '',
      // subOrder: '',
    });
    this.formListFoods = this.formBuilder.group({
      listFood: [[], [Validators.required]],
    });
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.foodIsSelect) {
      console.log(simpleChanges['foodIsSelect']);
      this.formEditValue.patchValue({
        id: simpleChanges['foodIsSelect']?.currentValue.id,
        name: simpleChanges['foodIsSelect']?.currentValue.name,
      });

      this.onEdit = true;
    } else this.onEdit = false;
  }
  private log(message: string) {
    this.messageSysService.addMess(`form-add-food: ${message}`);
  }
}
