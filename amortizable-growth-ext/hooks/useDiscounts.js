import React from 'react';
import { DiscountsContext } from 'components/cart/context.js';

export function useDiscounts() {
    const context = React.useContext(DiscountsContext);

    if (!context) {
        throw new Error('Expected a Discounts Context, but no Discounts Context was found');
    }

    return context;
}