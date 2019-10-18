import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceCustomerComponent } from './components/invoice-customer/invoice-customer.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '0/khach-hang/0'
  },
  {
    path: ':orderID/khach-hang/:customerID',
    component: InvoiceCustomerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
