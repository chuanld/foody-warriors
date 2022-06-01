import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodsComponent } from './foods/foods.component';
import { GuestsComponent } from './guests/guests.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'guests',
    component: GuestsComponent,
  },
  {
    path: 'guests/:id',
    component: GuestsComponent,
  },
  {
    path: 'foods',
    component: FoodsComponent,
  },
  {
    path: 'foods/:id',
    component: FoodsComponent,
  },
  {
    path: 'ticket-edit/:id',
    component: TicketDetailComponent,
  },
  {
    path: 'ticket-detail/:id',
    component: TicketDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
