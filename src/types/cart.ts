import { Product } from '@/hooks/useProducts';

// An item in the cart is the product plus a quantity.
export interface CartItem extends Product {
  quantity: number;
}