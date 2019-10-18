import { Refund } from './refund';
import { FeeOther } from './fee-other';

export interface Order {
  id: number,
  createdDate: Date,
  dateDone: Date | null,
  staffName: string,
  quantity: number,
  priceNotDiscount: number,
  discountPerItem: number,
  discount: number,
  priceDiscount: number,
  refund: Refund | null,
  remainderMoney: number,
  feeShipping: number,
  feeOthers: FeeOther[] | null,
  price: number
}
