// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

// Rxjs
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ANN Shop
import { environment } from 'src/environments/environment';
import { Customer } from '../../interfaces/common/customer';
import { Order } from '../../interfaces/common/order';
import { OrderItem } from '../../interfaces/common/order-item';


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
   * Lấy url api xóa order item
   * @param orderID Mã đơn hàng
   */
  private urlDeleteOrderItem(orderID: number) {
    return  environment.api + `/invoice/${orderID}/deleteOrderItem`;
  }

  /**
   * Lấy url api chỉnh sửa order item
   * @param orderID Mã đơn hàng
   */
  private urlEditOrderItem(orderID: number) {
    return  environment.api + `/invoice/${orderID}/editOrderItem`;
  }

  /**
   * Lấy url api thêm order item mới
   * @param orderID Mã đơn hàng
   */
  private urlAddOrderItem(orderID: number) {
    return  environment.api + `/invoice/${orderID}/addOrderItem`;
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

  /**
   * Khác hàng tạo một requirement xóa order item
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   * @param orderItem Order Item
   */
  deleteOrderItem(orderID: number, customerID: number, orderItem: OrderItem): Observable<boolean> {
    // Cài đặt header
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    const params = new HttpParams()
      .set('customerID', customerID.toString());

    return this.http.post(this.urlDeleteOrderItem(orderID), orderItem, {headers, params})
      .pipe(
        map((value: any) => value ? true : false),
        catchError((err: Error) => throwError(err))
      );
  }

  /**
   * Khác hàng tạo một requirement chỉnh sửa order item
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   * @param orderItem Order Item
   */
  editOrderItem(orderID: number, customerID: number, orderItem: OrderItem): Observable<boolean> {
    // Cài đặt header
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    const params = new HttpParams()
      .set('customerID', customerID.toString());

    return this.http.post(this.urlEditOrderItem(orderID), orderItem, {headers, params})
      .pipe(
        map((value: any) => value ? true : false),
        catchError((err: Error) => throwError(err))
      );
  }

  /**
   * Khác hàng tạo một requirement thêm order item
   * @param orderID Mã đơn hàng
   * @param customerID Mã khách hàng
   * @param orderItems Mãng Order Item
   */
  addOrderItem(orderID: number, customerID: number, orderItems: OrderItem[]): Observable<boolean> {
    // Cài đặt header
    const headers = new HttpHeaders({
      'Content-Type':  'application/json'
    })
    const params = new HttpParams()
      .set('customerID', customerID.toString());

    return this.http.post(this.urlAddOrderItem(orderID), orderItems, {headers, params})
      .pipe(
        map((value: any) => value ? true : false),
        catchError((err: Error) => throwError(err))
      );
  }
}
