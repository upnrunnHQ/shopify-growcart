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
    const minimumRequirementType = data ? data.minimumRequiremenType : "SUBTOTAL";
    const amountOrQuantity = "SUBTOTAL" === minimumRequirementType ? (cart.original_total_price / 100) : cart.item_count;

    if (discounts.length) {
        let hint = '';
        const currentRewards = amountOrQuantity ? discounts.filter(rule => parseFloat(rule.amountOrQuantity) <= amountOrQuantity) : discounts;
        const nextRewards = amountOrQuantity ? discounts.filter(rule => parseFloat(rule.amountOrQuantity) > amountOrQuantity) : [];
        const gettingMostRewards = amountOrQuantity ? currentRewards.length && (currentRewards.length === discounts.length) : false;
        const quantityList = amountOrQuantity ? discounts.map(rule => parseInt(rule.amountOrQuantity)) : [];
        const rewardsProgress = getRewardsProgress(amountOrQuantity, gettingMostRewards, Math.max(...quantityList));

        if (gettingMostRewards) {
            hint = 'You\'re getting the most rewards!';
        } else if (nextRewards.length) {
            hint = nextRewards[0].hint;
            hint = hint.replace('{{quantity}}', nextRewards[0].amountOrQuantity - amountOrQuantity);
            hint = hint.replace('{{title}}', nextRewards[0].title);
        }

        discountsContextValue = {
            amountOrQuantity,
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