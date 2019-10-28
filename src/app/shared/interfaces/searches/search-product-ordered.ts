import { Product } from '../common/product';


export interface SearchProductOrderd extends Product {
  price: number;
  createdDate: Date;
}
