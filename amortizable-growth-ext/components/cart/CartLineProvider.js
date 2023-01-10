import React from "react";
import { CartLineContext } from "components/cart/context.js";

export function CartLineProvider({ children, line }) {
  return (
    <CartLineContext.Provider value={line}>{children}</CartLineContext.Provider>
  );
}
