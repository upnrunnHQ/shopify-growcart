import { useContext } from "react";
import { CartLineContext } from 'components/cart/context.js';

export function useCartLine() {
  const context = useContext(CartLineContext);

  if (context == null) {
    throw new Error("Expected a cart line context but none was found");
  }

  return context;
}
