import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './components/customer-list/customer-list';
import { CustomerAdd } from './components/customer-add/customer-add';

const routes: Routes = [
  { path: '', component: CustomerListComponent },
  { path: 'customers/add', component: CustomerAdd },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
