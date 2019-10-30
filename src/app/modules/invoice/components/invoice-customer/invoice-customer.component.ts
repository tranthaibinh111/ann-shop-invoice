// Angular
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Title } from '@angular/platform-browser';

// modules (third-party)
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

// ANN Shop
// Component
import { ModalAddOrderItemComponent } from 'src/app/shared/components/modal-add-order-item/modal-add-order-item.component';
import { ModalEditOrderItemComponent } from 'src/app/shared/components/modal-edit-order-item/modal-edit-order-item.component';
import { ModalRemoveOrderItemComponent } from 'src/app/shared/components/modal-remove-order-item/modal-remove-order-item.component';
// Interface
import { Customer } from 'src/app/shared/interfaces/common/customer';
import { Order } from 'src/app/shared/interfaces/common/order';
import { OrderItem } from 'src/app/shared/interfaces/common/order-item';
// Service
import { LoadingSpinnerService } from 'src/app/shared/services/loading-spinner.service';
import { InvoiceCustomerService } from 'src/app/shared/services/pages/invoice-customer.service';


@Component({
  selector: 'app-invoice-customer',
  templateUrl: './invoice-customer.component.html',
  styleUrls: ['./invoice-customer.component.sass']
})
export class InvoiceCustomerComponent implements AfterViewInit, OnInit {
  // Modal
  config: ModalOptions;
  bsModalRef: BsModalRef;

  // Xử lý
  private searchPosition: any;
  public isSticky: boolean;
  public itemSelected: OrderItem;

  @ViewChild('search', { static: true }) _search: ElementRef;
  @ViewChildren('orderItem', { read: ElementRef }) _trItems: QueryList<ElementRef>;

  // Dữ liệu
  public customer: Customer;
  public order: Order;
  public orderItems: OrderItem[];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private loadingSpinner: LoadingSpinnerService,
    private service: InvoiceCustomerService) {
    // Modal
    this.config = {
      backdrop: "static",
      keyboard: false
    }

    // Xử lý
    this.loadingSpinner.show();
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
            .subscribe(data => {
              this.order = data;
              this.titleService.setTitle(`Bill #${this.order.id} - ${this.customer ? this.customer.fullName : ''}`);
            });
          // Thông tin các mon hàng đã mua
          this.service.getOrderItem(orderID, customerID)
            .subscribe(data => {
              this.orderItems = data;
              // Tính toán số tiền dựa trên order item
              this.calculatedAllPrice();
              this.loadingSpinner.close();
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

    let find: boolean = false;

    this._trItems.forEach((item: ElementRef) => {
      let itemElement: HTMLElement = item.nativeElement;
      let reg = new RegExp(`^${sku.toUpperCase().trim()}`, "g");

      if (reg.exec(itemElement.getAttribute('data-sku').toUpperCase().trim())) {
        let itemPointinY = itemElement.getBoundingClientRect().top;

        find = true;
        window.scrollTo(window.pageXOffset, window.pageYOffset + itemPointinY - 35);

        return false;
      }
    })

    if (find) {
      this.toastr.success(`Đã tìm thấy sản phẩm ${sku}`);
    }
    else {
      this.toastr.warning(`Không tìm thấy sản phẩm ${sku}`)
    }
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

  /**
   * Thêm sản phẩm
   */
  public addOrderItem() {
    this.config.initialState = { order: this.order, orderItemOlds: this.orderItems };
    this.bsModalRef = this.modalService.show(ModalAddOrderItemComponent, this.config);

    this.bsModalRef.content.orderItems$.subscribe((orderItem: OrderItem[]) => {
      this.loadingSpinner.show('Đang xử lý ...');

      // Gọi API sử lý
      this.service.addOrderItem(this.order.id, this.customer.id, orderItem)
        .subscribe(
          (success: boolean) => {
            if (success) {
              // Cập nhật lại order item
              this.orderItems.push(...orderItem);

              // Tính tiền lại đơn hàng
              this.calculatedAllPrice();
            }
            else {
              this.toastr.error('Lỗi trong quá trình thêm mới');
            }

            this.loadingSpinner.close();
          },
          (error: any) => {
            this.loadingSpinner.close();
            this.toastr.error('Lỗi trong quá trình thêm mới');
          }
        );
    })
  }

  /**
   * Chỉnh sửa số lượng sản phẩm đã đặt
   * @param item Sản phẩn đã đặt
   */
  public editOrderItem(item: OrderItem) {
    this.config.initialState = { order: this.order, item: item };
    this.bsModalRef = this.modalService.show(ModalEditOrderItemComponent, this.config);

    // Chờ đợi client chỉnh sửa order item
    this.bsModalRef.content.item$.subscribe((item: OrderItem) => {
      this.loadingSpinner.show('Đang xử lý ...');

      // Gọi API sử lý
      this.service.editOrderItem(this.order.id, this.customer.id, item)
        .subscribe(
          (success: boolean) => {
            if (success) {
              // Cập nhật lại order item
              this.orderItems
                .filter(x =>
                  x.product.productID == item.product.productID &&
                  x.product.productVariableID == item.product.productVariableID
                )
                .map((item: OrderItem) => {
                  item.quantity = item.quantity;
                  item.totalPrice = item.totalPrice;
                });

              // Tính tiền lại đơn hàng
              this.calculatedAllPrice();
            }
            else {
              this.toastr.error(`Lỗi trong quá trình cập nhật chỉnh sửa ${item.product.sku}`);
            }

            this.loadingSpinner.close();
          },
          (error: any) => {
            this.loadingSpinner.close();
            this.toastr.error(`Lỗi trong quá trình cập nhật chỉnh sửa ${item.product.sku}`);
          }
        );
    })
  }

  /**
   * Xóa sản phẩm đặt đặt
   * @param item Sản phẩn đã đật
   */
  public removeOrderItem(item: OrderItem) {
    this.config.initialState = { order: this.order, item: item };
    this.bsModalRef = this.modalService.show(ModalRemoveOrderItemComponent, this.config);

    // Chờ đợi client chấp nhận xóa order item
    this.bsModalRef.content.item$.subscribe((item: OrderItem) => {
      this.loadingSpinner.show('Đang xử lý ...');

      // Gọi API sử lý
      this.service.deleteOrderItem(this.order.id, this.customer.id, item)
        .subscribe(
          (success: boolean) => {
            if (success) {
              // Loại bỏ order item muốn xóa ra khỏi list
              this.orderItems = this.orderItems.filter(x => !(
                x.product.productID == item.product.productID &&
                x.product.productVariableID == item.product.productVariableID
              ));

              // Tính tiền lại đơn hàng
              this.calculatedAllPrice();
            }
            else {
              this.toastr.error(`Lỗi trong quá trình xóa ${item.product.sku}`);
            }

            this.loadingSpinner.close();
          },
          (error: any) => {
            this.loadingSpinner.close();
            this.toastr.error(`Lỗi trong quá trình xóa ${item.product.sku}`);
          }
        );
    })
  }

  /**
   * Tính toán số tiền dựa trên order item
   */
  private calculatedAllPrice() {
    let totalQuantity: number = 0;
    let totalPriceNotDiscount: number = 0;

    this.orderItems.forEach((item) => {
      totalQuantity += item.quantity;
      totalPriceNotDiscount += item.totalPrice;
    })

    // Tổng số lượng
    this.order.quantity = totalQuantity;
    // Tiền chư triết khấu
    this.order.priceNotDiscount = totalPriceNotDiscount;
    // Tiền qua triết khấu
    this.order.priceDiscount = this.order.priceNotDiscount - (totalQuantity * this.order.discountPerItem);
    // Tiền qua trả hàng
    this.order.remainderMoney = this.order.priceDiscount - (this.order.refund ? this.order.refund.refundMoney : 0);
    // Tiền có phí vẩn chuyển
    this.order.price = this.order.remainderMoney + this.order.feeShipping;
    // Tiền có phí khác
    let totalFeeOthers: number = this.order.feeOthers
      .map((x) => x.feePrice)
      .reduce((pre, cur) => pre + cur, 0);
    this.order.price = this.order.price + totalFeeOthers;
  }

  public getHotLine(staffName: string): string {
    if (staffName === 'nhom_zalo406')
      return '0913.268.406';
    if (staffName === 'nhom_zalo409')
      return '0918.567.409';
    if (staffName === 'nhom_zalo404')
      return '0936.786.404';
    if (staffName === 'nhom_facebook')
      return '0918.569.400';
    return '';
  }
}
