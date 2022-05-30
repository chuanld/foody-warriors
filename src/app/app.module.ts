import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuestsComponent } from './guests/guests.component';
import { MessageSysComponent } from './message-sys/message-sys.component';
import { FoodsComponent } from './foods/foods.component';
import { FoodSearchComponent } from './food-search/food-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { GuestFormComponent } from './guest-form/guest-form.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { FoodFormComponent } from './food-form/food-form.component';
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './modal/modal.component';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
// import { DialogService } from './services/dialog.service';
@NgModule({
  declarations: [
    AppComponent,
    GuestsComponent,
    MessageSysComponent,
    FoodsComponent,
    FoodSearchComponent,
    DashboardComponent,
    GuestFormComponent,
    TicketDetailComponent,
    FoodFormComponent,
    LoadingComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
    }),
    MatDialogModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSliderModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
