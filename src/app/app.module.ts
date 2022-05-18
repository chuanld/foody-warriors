import { NgModule } from '@angular/core';
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
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
