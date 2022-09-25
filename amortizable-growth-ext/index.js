fetch('/apps/growcart/api/rewards', {
    headers: {
        'ngrok-skip-browser-warning': 'skip'
    },
})
    .then((response) => response.json())
    .then((data) => console.log(data));

import React from "react";
import ReactDOM from "react-dom";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { CartProvider, DiscountsProvider, Cart } from "components";
import "./product-form.js";
import "./sass/index.scss";

// Create a client
const queryClient = new QueryClient()

ReactDOM.render(
    <QueryClientProvider client={queryClient}>
        <DiscountsProvider>
            <CartProvider>
                <Cart />
            </CartProvider>
        </DiscountsProvider>
    </QueryClientProvider>,
    document.getElementById("growcarthq")
);
