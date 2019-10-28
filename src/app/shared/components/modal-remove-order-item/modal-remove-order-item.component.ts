// Angular
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

// ANN Shop
import { Order } from '../../interfaces/pages/invoice-customer/order';
import { OrderItem } from '../../interfaces/pages/invoice-customer/order-item';
import { Subject, Observable } from 'rxjs';


@Component({
  selector: 'app-modal-remove-order-item',
  templateUrl: './modal-remove-order-item.component.html',
  styleUrls: ['./modal-remove-order-item.component.sass']
})
export class ModalRemoveOrderItemComponent {
  private itemSubject$: Subject<OrderItem>;
  public readonly item$: Observable<OrderItem>;

  public orderID: Order;
  public item: OrderItem;

  constructor(private bsModalRef: BsModalRef) {
    this.itemSubject$ = new Subject();
    this.item$ = this.itemSubject$.asObservable();
  }

  confirm() {
    this.itemSubject$.next(this.item);
    this.bsModalRef.hide();
  }

  decline() {
    this.bsModalRef.hide();
  }
}
