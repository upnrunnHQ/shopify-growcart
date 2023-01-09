export async function fetchCartContents() {
  const response = await fetch(window.Shopify.routes.root + "cart.js");

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function fetchRecommendations({ queryKey }) {
  const response = await fetch(
    window.Shopify.routes.root +
      "recommendations/products.json?product_id=" +
      queryKey[1] +
      "&limit=5&intent=related"
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function updateLineItem(line) {
  const response = await fetch(window.Shopify.routes.root + "cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...line,
      sections: ["cart-icon-bubble"],
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function addLineItem(line) {
  const response = await fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [line],
      sections: ["cart-icon-bubble"],
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
