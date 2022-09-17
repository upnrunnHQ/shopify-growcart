import React, { useCallback } from 'react';
import {
    useCartLine,
} from '@shopify/hydrogen';
import { useCart } from 'hooks';

export function CartLineQuantityAdjustButton(props) {
    const { isLoading, lineUpdate } = useCart();
    const cartLine = useCartLine();
    const { children, adjust, ...passthroughProps } = props;

    const handleAdjust = useCallback(() => {
        if (adjust === 'remove') {
            lineUpdate({ id: cartLine.key, quantity: 0 });
            return;
        }

        const quantity =
            adjust === 'decrease' ? cartLine.quantity - 1 : cartLine.quantity + 1;

        if (quantity <= 0) {
            lineUpdate({ id: cartLine.key, quantity: 0 });
            return;
        }

        lineUpdate({ id: cartLine.key, quantity });
    }, [adjust, cartLine.key, cartLine.quantity, lineUpdate]);

    return (
        <button
            type="button"
            disabled={isLoading}
            onClick={handleAdjust}
            {...passthroughProps}
        >
            {children}
        </button>
    );
}