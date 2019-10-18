// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Rxjs
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ANN Shop
import { environment } from 'src/environments/environment';
import { Customer } from '../../interfaces/pages/invoice-customer/customer';
import { Order } from '../../interfaces/pages/invoice-customer/order';
import { OrderItem } from '../../interfaces/pages/invoice-customer/order-item';


@Injectable({
  providedIn: 'root'
})
export class InvoiceCustomerService {

  constructor(private http: HttpClient) { }

  /**
   * Lấy url api thông tin khách khàng
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   */
  private urlCustomer(orderID: number, customerID: number) {
    return  environment.api + `/invoice/${orderID}/getCustomer?customerID=${customerID}`;
  }

  /**
   * Lấy url api thông tin chung của hóa đơn
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   */
  private urlOrder(orderID: number, customerID: number) {
    return  environment.api + `/invoice/${orderID}/getOrder?customerID=${customerID}`;
  }

  /**
   * Lấy url api thông tin các sản phẩm mua hàng
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   */
  private urlOrderItems(orderID: number, customerID: number) {
    return  environment.api + `/invoice/${orderID}/getOrderItems?customerID=${customerID}`;
  }

  /**
   * Lấy thông tin khách hàng mua mã đơn này
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   */
  getCustomer(orderID: number, customerID: number): Observable<Customer> {
    return this.http.get(this.urlCustomer(orderID, customerID))
      .pipe(
        map((value: Customer) => value),
        catchError((err: Error) => throwError(err))
      );
  }

  getOrder(orderID: number, customerID: number): Observable<Order> {
    return this.http.get(this.urlOrder(orderID, customerID))
      .pipe(
        map((value: Order) => value),
        catchError((err: Error) => throwError(err))
      );
  }

  /**
   * Lấy thông tin sản phẩm mà khách hàng đã mua
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   */
  getOrderItem(orderID: number, customerID: number): Observable<OrderItem[]> {
    return this.http.get(this.urlOrderItems(orderID, customerID))
      .pipe(
        map((value: OrderItem[]) => value),
        catchError((err: Error) => throwError(err))
      );
  }
}
