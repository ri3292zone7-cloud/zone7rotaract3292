import { createContext, useContext } from 'react';

export const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}
