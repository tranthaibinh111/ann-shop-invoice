// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';

// ANN Shop
import { InvoiceCustomerService } from 'src/app/shared/services/pages/invoice-customer.service';

import { Customer } from 'src/app/shared/interfaces/pages/invoice-customer/customer';
import { Order } from 'src/app/shared/interfaces/pages/invoice-customer/order';
import { OrderItem } from 'src/app/shared/interfaces/pages/invoice-customer/order-item';


@Component({
  selector: 'app-invoice-customer',
  templateUrl: './invoice-customer.component.html',
  styleUrls: ['./invoice-customer.component.sass']
})
export class InvoiceCustomerComponent implements AfterViewInit, OnInit {
  // Xử lý
  private searchPosition: any;
  public isSticky: boolean;
  public isLoading: boolean;

  @ViewChild('search', { static: true }) _search: ElementRef;
  @ViewChildren('orderItem', { read: ElementRef }) _orderItems: QueryList<ElementRef>;

  // Dữ liệu
  public customer: Customer;
  public order: Order;
  public orderItems: OrderItem[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private service: InvoiceCustomerService) {
    this.isLoading = true;
    this.isSticky = false;
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        let orderID: number = params.orderID;
        let customerID: number = params.customerID;

        if (orderID > 0 && customerID > 0) {
          // Thông tin khách hàng
          this.service.getCustomer(orderID, customerID)
            .subscribe(data => this.customer = data);
          // Thông tin đơn hàng
          this.service.getOrder(orderID, customerID)
            .subscribe(data => this.order = data);
          // Thông tin các mon hàng đã mua
          this.service.getOrderItem(orderID, customerID)
            .subscribe(data => {
              this.orderItems = data;
              this.isLoading = false;
            });
        }
        else {
          this.router.navigate(['**']);
        }
      });
  }

  ngAfterViewInit() {
    this.searchPosition = this.searchElement.getBoundingClientRect().top;
  }

  @HostListener('window:scroll', [])
  onWindowSroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= this.searchPosition)
      this.isSticky = true;
    else
      this.isSticky = false;
  }

  /**
   * Lấy DOM div search
   */
  get searchElement(): HTMLElement {
    return this._search.nativeElement;
  }

  /**
   * Thực thi tim kiếm sản phẩm đã mua
   * @param sku Mã sản phẩm lấy từ input search
   */
  searchProduct(sku: string) {
    if (sku.length === 0)
      return;

    this._orderItems.forEach((item: ElementRef) => {
      let itemElement: HTMLElement = item.nativeElement;

      if (sku.trim() === itemElement.getAttribute('data-sku')) {
        let itemPointinY = itemElement.getBoundingClientRect().top;
        window.scrollTo(window.pageXOffset, window.pageYOffset + itemPointinY - 35);
        return false;
      }
    })
  }

  /**
   * Kiểm tra xem có triết khấu không
   */
  get haveDiscount(): boolean {
    if (this.order && this.order.discountPerItem > 0)
      return true;
    else
      return false;
  }

  /**
   * Kiểm tra xem có đổi trả hàng không
   */
  get haveRefund(): boolean {
    if (this.order && this.order.refund && this.order.refund.refundMoney != 0)
      return true;
    else
      return false;
  }

  /**
   * Kiểm tra xe có phí giao hàng không
   */
  get haveShipping(): boolean {
    if (this.order && this.order.feeShipping > 0)
      return true;
    else
      return false;
  }

  /**
   * Kiểm tra xem có các loại phí khác không
   */
  get haveFeeOther(): boolean {
    if (this.order && this.order.feeOthers && this.order.feeOthers.length > 0)
      return true;
    else
      return false;
  }
}
