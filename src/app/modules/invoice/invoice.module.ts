import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceCustomerComponent } from './components/invoice-customer/invoice-customer.component';


@NgModule({
  declarations: [InvoiceCustomerComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule { }
