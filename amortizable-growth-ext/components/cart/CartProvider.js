import React, { useState, useEffect } from 'react';
import {
    useQueryClient,
    useQuery,
    useMutation
} from '@tanstack/react-query';
import { CartContext } from './context.js';
import { fetchCartContents, updateLineItem } from './api.js';

export function CartProvider({ children }) {
    const queryClient = useQueryClient();
    const [displayCart, setDisplayCart] = useState(false);
    const { isLoading, isError, data: cartContents, error } = useQuery(['cartContents'], fetchCartContents);
    const {
        isLoading: isMutationLoading,
        isError: isMutationError,
        error: mutationError,
        mutate,
    } = useMutation(updateLineItem, {
        onSuccess: (response) => {
            queryClient.invalidateQueries(['cartContents']);
            document.getElementById("cart-icon-bubble").innerHTML =
                getSectionInnerHTML(response.sections["cart-icon-bubble"]);
        },
    });
    const cartContextValue = {
        displayCart,
        setDisplayCart,
        isLoading: isLoading || isMutationLoading,
        isError: isError || isMutationError,
        error: error || mutationError,
        cart: typeof cartContents === 'undefined' ? {
            attributes: {},
            cart_level_discount_applications: [],
            items: [],
            item_count: 0,
        } : cartContents,
        lineUpdate(line) {
            mutate(line);
        },
    };

    function getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector(selector).innerHTML;
    }

    useEffect(() => {
        const cartIconBubble = document.getElementById('cart-icon-bubble');
        cartIconBubble.addEventListener('click', (event) => {
            event.preventDefault();
            setDisplayCart(true);
        });
        
        document.body.addEventListener('added_to_cart', () => {
            queryClient.invalidateQueries(['cartContents']);
            setDisplayCart(true);
        });
    }, [])

    return (
        <CartContext.Provider value={cartContextValue}>
            {children}
        </CartContext.Provider>
    );
}