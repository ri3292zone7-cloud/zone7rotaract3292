import { useContext } from 'react';
import { StoreCartContext } from './store-cart-context';

export function useStoreCart() {
  const ctx = useContext(StoreCartContext);
  if (!ctx) throw new Error('useStoreCart must be used inside <StoreCartProvider>');
  return ctx;
}