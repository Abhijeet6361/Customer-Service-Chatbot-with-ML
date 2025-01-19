export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

export interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: number, change: number) => void;
  removeFromCart: (id: number) => void;
  cartTotal: number;
  cartItemCount: number;
}