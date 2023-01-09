import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "hooks";
import { fetchRecommendations } from "./api.js";
import { Money } from "components";

export function Recommendations() {
  const { isLoading, cart, addLine } = useCart();
  const {
    isLoading: isRecommendationsLoading,
    isError,
    data,
    error,
  } = useQuery(
    ["recommendations", cart.items[cart.items.length - 1].product_id],
    fetchRecommendations
  );
  if (isRecommendationsLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (data.products.length === 0) {
    return null;
  }

  return (
    <div className="Recommendations">
      <div className="Recommendations__header">
        <h2>Recommended Products</h2>
      </div>
      {data.products.map((product) => (
        <div className="Recommendations__item">
          <div className="Recommendations__item-image">
            <a href="">
              <img src={product.featured_image} />
            </a>
          </div>
          <div className="Recommendations__item-text">
            <h3>
              <a href={product.url}>{product.title}</a>
            </h3>
            <Money
              data={{
                amount: String(product.price),
                currencyCode: cart.currency,
              }}
            />
          </div>
          <div className="Recommendations__item-add">
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                addLine({
                  id: product.variants[0].id,
                  quantity: 1,
                })
              }
              disabled={isLoading}
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
