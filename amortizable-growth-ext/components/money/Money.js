import React from 'react';

function useMoney(money) {
    const amount = parseFloat(money.amount);
    const options = {
        style: 'currency',
        currency: window.Shopify.currency.active,
    };

    const defaultFormatter = new Intl.NumberFormat(window.Shopify.locale, options);

    return {
        localizedString: () => defaultFormatter.format(amount / 100),
    };
}

export function Money({ data }) {
    const moneyObject = useMoney(data);
    const localizedString = moneyObject.localizedString();

    return (
        <div>
            {localizedString}
        </div>
    );
}