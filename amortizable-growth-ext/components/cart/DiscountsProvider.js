import React from 'react';
import { useCart, useDiscountsQuery } from 'hooks';
import { getRewardsProgress } from 'lib/utils';
import { DiscountsContext } from './context.js';

export function DiscountsProvider({ children }) {
    const {
        cart
    } = useCart();
    const { data } = useDiscountsQuery();

    let discountsContextValue = {
        discounts: [],
        currentRewards: [],
        nextRewards: [],
        gettingMostRewards: false,
        rewardsProgress: 0,
        hint: '',
    };

    const discounts = data ? JSON.parse(data.discounts) : [];

    if (discounts.length) {
        let hint = '';
        const currentRewards = cart.item_count ? discounts.filter(rule => rule.amountOrQuantity <= cart.item_count) : discounts;
        const nextRewards = cart.item_count ? discounts.filter(rule => rule.amountOrQuantity > cart.item_count) : [];
        const gettingMostRewards = cart.item_count ? currentRewards.length && (currentRewards.length === discounts.length) : false;
        const quantityList = cart.item_count ? discounts.map(rule => parseInt(rule.amountOrQuantity)) : [];
        const rewardsProgress = getRewardsProgress(cart, gettingMostRewards, quantityList);

        if (gettingMostRewards) {
            hint = 'You\'re getting the most rewards!';
        } else if (nextRewards.length) {
            hint = nextRewards[0].hint;
            hint = hint.replace('{{quantity}}', nextRewards[0].amountOrQuantity - cart.item_count);
            hint = hint.replace('{{title}}', nextRewards[0].title);
        }

        discountsContextValue = {
            discounts,
            currentRewards,
            nextRewards,
            gettingMostRewards,
            rewardsProgress,
            hint,
        }
    }

    console.log(data);
    console.log(discountsContextValue);

    return (
        <DiscountsContext.Provider value={discountsContextValue}>
            {children}
        </DiscountsContext.Provider>
    );
}