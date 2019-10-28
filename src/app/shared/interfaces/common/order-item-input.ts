// Angular
import { FormControl } from '@angular/forms';

// ANN Shop
import { OrderItem } from './order-item';


export interface OrderItemInput extends OrderItem {
  quantityControl: FormControl | null
}
