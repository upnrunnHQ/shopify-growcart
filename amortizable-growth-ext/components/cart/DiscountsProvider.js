import React from 'react';
import { useDiscountsQuery } from 'hooks';
import { DiscountsContext } from './context.js';

export function DiscountsProvider({ children }) {
    const discountsContextValue = useDiscountsQuery();

    console.log(discountsContextValue);

    return (
        <DiscountsContext.Provider value={discountsContextValue}>
            {children}
        </DiscountsContext.Provider>
    );
}