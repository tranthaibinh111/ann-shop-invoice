import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules (third-party)
import { ModalModule } from 'ngx-bootstrap/modal';
import { LazyLoadImageModule, intersectionObserverPreset  } from 'ng-lazyload-image';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceCustomerComponent } from './components/invoice-customer/invoice-customer.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [InvoiceCustomerComponent],
  imports: [
    CommonModule,
    // modules (third-party)
    ModalModule.forRoot(),
    LazyLoadImageModule.forRoot({ preset: intersectionObserverPreset }),
    // modules
    InvoiceRoutingModule,
    SharedModule,
  ]
})
export class InvoiceModule { }
