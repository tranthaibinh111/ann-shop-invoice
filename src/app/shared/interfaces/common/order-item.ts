import { Product } from './product';


export interface OrderItem {
  id: number | null,
  product: Product,
  quantity: number,
  price: number,
  totalPrice: number
}
