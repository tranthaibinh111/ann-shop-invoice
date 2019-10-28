import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// modules (third-party)
import { ModalModule } from 'ngx-bootstrap/modal';
import { LazyLoadImageModule, intersectionObserverPreset  } from 'ng-lazyload-image';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

// components
import { AlertComponent } from './components/alert/alert.component';
import { IconComponent } from './components/icon/icon.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { LoadingSpinnerComponent } from '../shared/components/loading-spinner/loading-spinner.component';
import { ModalAddOrderItemComponent } from '../shared/components/modal-add-order-item/modal-add-order-item.component';
import { ModalEditOrderItemComponent } from '../shared/components/modal-edit-order-item/modal-edit-order-item.component';
import { ModalRemoveOrderItemComponent } from '../shared/components/modal-remove-order-item/modal-remove-order-item.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ScrollComponent } from '../shared/components/scroll/scroll.component';
// pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';


@NgModule({
    declarations: [
        // components
        AlertComponent,
        IconComponent,
        InputNumberComponent,
        LoadingBarComponent,
        LoadingSpinnerComponent,
        ModalAddOrderItemComponent,
        ModalEditOrderItemComponent,
        ModalRemoveOrderItemComponent,
        PaginationComponent,
        ScrollComponent,
        // pipes
        CurrencyFormatPipe,
    ],
    entryComponents: [
      ModalAddOrderItemComponent,
      ModalEditOrderItemComponent,
      ModalRemoveOrderItemComponent,
    ],
    imports: [
        // modules (angular)
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // modules (third-party)
        ModalModule.forRoot(),
        LazyLoadImageModule.forRoot({ preset: intersectionObserverPreset }),
        AutocompleteLibModule,
    ],
    exports: [
        // components
        AlertComponent,
        IconComponent,
        InputNumberComponent,
        LoadingBarComponent,
        LoadingSpinnerComponent,
        ModalAddOrderItemComponent,
        ModalEditOrderItemComponent,
        ModalRemoveOrderItemComponent,
        PaginationComponent,
        ScrollComponent,
        // pipes
        CurrencyFormatPipe
    ]
})
export class SharedModule { }
