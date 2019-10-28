import { Product } from './product';
import { FormControl } from '@angular/forms';

export interface OrderItem {
  id: number | null,
  product: Product,
  quantity: number,
  quantityControl: FormControl | null,
  price: number,
  totalPrice: number
}
