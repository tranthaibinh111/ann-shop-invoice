// Angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

// Rxjs
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ANN Shop
// Environment
import { environment } from 'src/environments/environment';
// Model
import { SearchProductOrderd } from '../../interfaces/searches/search-product-ordered';


@Injectable({
  providedIn: 'root'
})
export class SearchProductOrderService {

  constructor(private http: HttpClient) { }

  /**
   * Lấy url api thông tin sản phân
   */
  private urlProductOrdered() {
    return  environment.api + '/search/getProductOrdered';
  }

  /**
   * Gợi ý sản phẩm cần tìm
   * @param orderType Thể loại đơn hàng (sỉ / lẻ)
   * @param sku Mã sản phẩm
   */
  getProductOrdered(orderType: number, sku: string): Observable<SearchProductOrderd[]> {
    const params:HttpParams = new HttpParams()
      .set("orderType", orderType.toString())
      .set("sku", sku);

    return this.http.get(this.urlProductOrdered(), {params})
      .pipe(
        map((value: SearchProductOrderd[]) => value),
        catchError((err: Error) => throwError(err))
      );
  }
}
