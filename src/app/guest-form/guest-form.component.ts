import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Guest } from '../guest';
import { Food } from '../food';
import { FormBuilder } from '@angular/forms';
import { MessageSysService } from '../message-sys.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guest-form',
  templateUrl: './guest-form.component.html',
  styleUrls: ['./guest-form.component.css'],
})
export class GuestFormComponent implements OnInit {
  guest: Guest;
  @Output() isClickSubmit = new EventEmitter<Guest>();
  @Input() foods: Array<Food>;
  id: number | 0;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private messageSysService: MessageSysService
  ) {}

  formValues = this.formBuilder.group({
    name: '',
    order: '',
    subOrder: '',
  });

  onSubmit() {
    if (!this.formValues.valid) return this.log('Form invalid');
    const infHero = this.formValues.value;

    this.isClickSubmit.emit(infHero);
    this.formValues.reset();
  }
  showFormControls(form: any) {
    return form && form.controls.name && form.controls.name.value;
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.formValues = this.formBuilder.group({
      name: '',
      order: this.id,
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
}
