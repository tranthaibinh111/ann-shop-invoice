// Angular
import { Component, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, Validators } from '@angular/forms';

// modules (third-party)
import { ToastrService } from 'ngx-toastr';

//Rxjs
import { Observable, of, Subject } from 'rxjs';
import { tap, switchMap, takeUntil, map } from 'rxjs/operators';

// ANN Shop
import { SearchProductOrderd } from '../../interfaces/searches/search-product-ordered';
import { SearchProductOrderService } from '../../services/searches/search-product-order.service';
import { Order } from '../../interfaces/common/order';
import { OrderItemInput } from '../../interfaces/common/order-item-input';
import { OrderItem } from '../../interfaces/common/order-item';

@Component({
  selector: 'app-modal-add-order-item',
  templateUrl: './modal-add-order-item.component.html',
  styleUrls: ['./modal-add-order-item.component.sass']
})
export class ModalAddOrderItemComponent implements OnDestroy {
  private destroy$: Subject<void>;

  // Search Product Ordered
  private selected: boolean;

  public searchValue: string;
  public searchLoading: boolean
  public searchResult$: Observable<SearchProductOrderd[]>;

  // Thông tin order
  public order: Order;
  public orderItemOlds: OrderItem[];
  // Các sản phẩm đặt hàng mới
  public orderItems: OrderItemInput[];
  private orderItemsSubject$: Subject<OrderItem[]>;
  public readonly orderItems$: Observable<OrderItem[]>;

  constructor(
    private bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private search: SearchProductOrderService
  ) {
    this.destroy$ = new Subject();

    // Search product ordered
    this.selected = false;

    this.searchValue = "";
    this.searchLoading = false;
    this.searchResult$ = new Observable();

    // Order Item new
    this.orderItems = [];
    this.orderItemsSubject$ = new Subject();
    this.orderItems$ = this.orderItemsSubject$.pipe(takeUntil(this.destroy$));
  }

  // https://www.npmjs.com/package/angular-ng-autocomplete#inputs
  onChangeSearch(valueNew: string) {
    // Trường hợp khi giá chị search được chọn từ danh sách gợi ý
    if (this.selected == true) {
      this.selected = false;
      return;
    }

    // Trường hợp search rỗng
    if (valueNew === "") return;

    // Thực hiện gọi api với giá trị search mới
    if (this.searchValue !== valueNew) {
      this.searchLoading = true
      this.searchValue = valueNew;
      this.searchResult$ = of(valueNew)
        .pipe(
          tap(_ => this.searchLoading = true),
          switchMap((sku: string) => this.search.getProductOrdered(this.order.kind, this.searchValue)),
          tap(_ => this.searchLoading = false)
        );
      return;
    }
  }

  // https://www.npmjs.com/package/angular-ng-autocomplete#inputs
  selectEvent(productOrdered: SearchProductOrderd) {
    // Xử lý search product order
    this.selected = true;
    this.searchResult$ = of([productOrdered]);

    // Kiểm tra xem có phải là sản phẩm mới không
    let index: number = this.orderItemOlds
      .findIndex((item: OrderItem) =>
        item.product.productID === productOrdered.productID
        && item.product.productVariableID === productOrdered.productVariableID
      );


    console.log(this.orderItemOlds, productOrdered)
    if (index > -1) {
      return this.toastr.warning("Sản phẩm này bạn đã đặt hàng rồi");
    }

    // Check xem sản phẩm mới này đã thêm rồi chưa
    let isOrderItemNew: boolean = true;

    this.orderItems
      .filter(
        (item: OrderItemInput) =>
          (item.product.productID === productOrdered.productID) &&
          (item.product.productVariableID === productOrdered.productVariableID)
      )
      .map((item: OrderItemInput) => {
        let value: number = item.quantityControl.value;
        item.quantityControl.setValue(++value);
        isOrderItemNew = false;
      });

    if (isOrderItemNew) {
      // Xử lý thêm sản phẩm cần mua
      let orderItemNew: OrderItemInput = {
        id: null,
        product: productOrdered,
        quantity: 1,
        quantityControl: new FormControl(1, Validators.required),
        price: productOrdered.price,
        discount: 0,
        totalPrice: productOrdered.price
      };
      this.orderItems.push(orderItemNew);
    }

    this.toastr.success(`Đã thêm sản phẩm ${productOrdered.sku}`);
  }

  get disabledConfirm(): boolean {
    let index: number = this.orderItems
      .findIndex(
        (item: OrderItemInput) =>
          (item.quantityControl.errors && item.quantityControl.errors.required) ||
          item.quantityControl.value < 1
      );

    return index === -1 ? false : true
  }

  confirm() {
    this.orderItems.map(
      (item: OrderItemInput) => {
        item.quantity = item.quantityControl.value;
        item.totalPrice = item.price * item.quantity;
      }
    );
    this.orderItemsSubject$.next(this.orderItems);

    this.bsModalRef.hide();
  }

  decline() {
    this.bsModalRef.hide();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
