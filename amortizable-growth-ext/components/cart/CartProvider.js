import React, { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { CartContext } from "./context.js";
import { fetchCartContents, addLineItem, updateLineItem } from "./api.js";

export function CartProvider({ children }) {
  const queryClient = useQueryClient();
  const [displayCart, setDisplayCart] = useState(false);
  const {
    isLoading,
    isError,
    data: cartContents,
    error,
  } = useQuery(["cartContents"], fetchCartContents);
  const {
    isLoading: isMutationLoading,
    isError: isMutationError,
    error: mutationError,
    mutate,
  } = useMutation(updateLineItem, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["cartContents"]);
      queryClient.invalidateQueries(["recommendations"]);
      document.getElementById("cart-icon-bubble").innerHTML =
        getSectionInnerHTML(response.sections["cart-icon-bubble"]);
    },
  });
  const {
    isLoading: isAddLineItemLoading,
    isError: isAddLineItemError,
    error: addLineItemError,
    mutate: addLine,
  } = useMutation(addLineItem, {
    onSuccess: (response) => {
      queryClient.invalidateQueries(["cartContents"]);
      queryClient.invalidateQueries(["recommendations"]);
      document.getElementById("cart-icon-bubble").innerHTML =
        getSectionInnerHTML(response.sections["cart-icon-bubble"]);
    },
  });
  const cartContextValue = {
    displayCart,
    setDisplayCart,
    isLoading: isLoading || isAddLineItemLoading || isMutationLoading,
    isError: isError || isAddLineItemError || isMutationError,
    error: error || addLineItemError || mutationError,
    cart:
      typeof cartContents === "undefined"
        ? {
            attributes: {},
            cart_level_discount_applications: [],
            currency: "USD",
            item_count: 0,
            items: [],
          }
        : cartContents,
    addLine(line) {
      addLine(line);
    },
    lineUpdate(line) {
      mutate(line);
    },
  };

  function getSectionInnerHTML(html, selector = ".shopify-section") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector(selector).innerHTML;
  }

  useEffect(() => {
    const cartIconBubble = document.getElementById("cart-icon-bubble");
    cartIconBubble.addEventListener("click", (event) => {
      event.preventDefault();
      setDisplayCart(true);
    });

    document.body.addEventListener("added_to_cart", () => {
      queryClient.invalidateQueries(["cartContents"]);
      setDisplayCart(true);
    });
  }, []);

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
}
