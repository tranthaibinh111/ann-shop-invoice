// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

//Rxjs
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ANN Shop
import { Order } from '../../interfaces/common/order';
import { OrderItemInput } from '../../interfaces/common/order-item-input';
import { OrderItem } from '../../interfaces/common/order-item';


@Component({
  selector: 'app-modal-edit-order-item',
  templateUrl: './modal-edit-order-item.component.html',
  styleUrls: ['./modal-edit-order-item.component.sass']
})
export class ModalEditOrderItemComponent implements OnInit, OnDestroy{
  private destroy$: Subject<void>;
  private itemSubject$: Subject<OrderItem>;
  public readonly item$: Observable<OrderItem>;

  public orderID: Order;
  public item: OrderItemInput;

  constructor(private bsModalRef: BsModalRef) {
    this.destroy$ = new Subject();
    this.itemSubject$ = new Subject();
    this.item$ = this.itemSubject$.pipe(takeUntil(this.destroy$));
  }

  ngOnInit() {
    if(this.item) {
      this.item.quantityControl = new FormControl(this.item.quantity, Validators.required);
    }
  }

  get disabledConfirm() : boolean {
    let disabled: boolean = true;

    if (this.item.quantityControl)
    {
      if (!this.item.quantityControl.errors)
        disabled = disabled && false;

      if (this.item.quantityControl.value > 0 && this.item.quantityControl.value == this.item.quantity)
        disabled = disabled && false;
    }

    return disabled
  }
  confirm () {
    this.item.quantity = this.item.quantityControl.value;
    this.item.totalPrice = this.item.price * this.item.quantity;
    this.itemSubject$.next(this.item);
    this.bsModalRef.hide();
  }

  decline () {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
