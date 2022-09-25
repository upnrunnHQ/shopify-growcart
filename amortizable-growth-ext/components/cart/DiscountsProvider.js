import React from 'react';
import { useCart, useDiscountsQuery } from 'hooks';
import { DiscountsContext } from './context.js';

function getRewardsProgress(cart, gettingMostRewards, quantityList) {
    if (gettingMostRewards) {
        return 100;
    }

    if (cart.item_count && quantityList.length) {
        return (cart.item_count / Math.max(quantityList)) * 100;
    }

    return 0;
}

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

    const discounts = data ? JSON.parse(data.discounts): [];

    if (discounts.length) {
        let hint = '';
        const currentRewards = cart.item_count ? discounts.filter(rule => rule.amountOrQuantity <= cart.item_count) : discounts;
        const nextRewards = cart.item_count ? discounts.filter(rule => rule.amountOrQuantity > cart.item_count) : [];
        const gettingMostRewards = cart.item_count ? currentRewards.length && (currentRewards.length === discounts.length) : false;
        const quantityList = cart.item_count ? discounts.map(rule => rule.amountOrQuantity) : [];
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

    return (
        <DiscountsContext.Provider value={discountsContextValue}>
            {children}
        </DiscountsContext.Provider>
    );
}