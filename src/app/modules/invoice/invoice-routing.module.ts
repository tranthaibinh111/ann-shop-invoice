import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceCustomerComponent } from './components/invoice-customer/invoice-customer.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'khach-hang'
  },
  {
    path: 'khach-hang',
    component: InvoiceCustomerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
