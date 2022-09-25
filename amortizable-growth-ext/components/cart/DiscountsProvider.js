import React from 'react';
import { DiscountsContext } from './context.js';

export function DiscountsProvider({ children }) {
    const discountsContextValue = [];
    return (
        <DiscountsContext.Provider value={discountsContextValue}>
            {children}
        </DiscountsContext.Provider>
    );
}