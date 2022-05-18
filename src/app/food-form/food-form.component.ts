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
import { Form, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MessageSysService } from '../message-sys.service';

@Component({
  selector: 'app-food-form',
  templateUrl: './food-form.component.html',
  styleUrls: ['./food-form.component.css'],
})
export class FoodFormComponent implements OnInit, OnChanges {
  @Input() foodIsSelect: Food | any;
  @Output() isClickSubmit = new EventEmitter<Food>();
  @Output() isClickEditSubmit = new EventEmitter<Food>();
  @Input() foods: Array<Food>;
  onEdit: boolean;
  formValues: FormGroup;
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
      this.foodIsSelect = '';
      this.onEdit = false;
      return;
    }
    if (!this.formValues.valid) return this.log('Form invalid');
    const infFood = this.formValues.value;
    console.log('adding');
    this.isClickSubmit.emit(infFood);
    this.formValues.reset();
  }

  showFormControls(form: any) {
    return form && form.controls.name && form.controls.name.value;
  }

  formEditValue = this.formBuilder.group({
    id: '',
    name: '',
  });
  ngOnInit(): void {
    this.formValues = this.formBuilder.group({
      name: '',
      // order: '',
      // subOrder: '',
    });
    console.log(this.formEditValue.value, 'formvalueEdit in init');
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if (this.foodIsSelect) {
      this.formEditValue.patchValue({
        id: simpleChanges['foodIsSelect'].currentValue.id,
        name: simpleChanges['foodIsSelect'].currentValue.name,
      });

      this.onEdit = true;
    } else this.onEdit = false;
  }
  private log(message: string) {
    this.messageSysService.addMess(`form-add-food: ${message}`);
  }
}
