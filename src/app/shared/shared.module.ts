import { NgModule } from '@angular/core';

// modules (angular)
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// modules (third-party)
import { ModalModule } from 'ngx-bootstrap/modal';

// components
import { AlertComponent } from './components/alert/alert.component';
import { IconComponent } from './components/icon/icon.component';
import { InputNumberComponent } from './components/input-number/input-number.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { PaginationComponent } from './components/pagination/pagination.component';

// pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';


@NgModule({
    declarations: [
        // components
        AlertComponent,
        IconComponent,
        InputNumberComponent,
        LoadingBarComponent,
        PaginationComponent,
        // pipes
        CurrencyFormatPipe
    ],
    imports: [
        // modules (angular)
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        // modules (third-party)
        ModalModule.forRoot()
    ],
    exports: [
        // components
        AlertComponent,
        IconComponent,
        InputNumberComponent,
        LoadingBarComponent,
        PaginationComponent,
        // pipes
        CurrencyFormatPipe
    ]
})
export class SharedModule { }
