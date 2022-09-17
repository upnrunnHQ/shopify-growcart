import React from 'react';
import { useCart } from 'hooks';
import { Text, Money } from 'components';

export function OrderSummary() {
    const { cart } = useCart();
    const { items_subtotal_price, currency } = cart;

    return (
        <>
            <dl className="OrderSummary">
                <div className="OrderSummary__item">
                    <Text as="dt">Subtotal</Text>
                    <Text as="dd">
                        <Money data={{ amount: String(items_subtotal_price), currencyCode: currency }} />
                    </Text>
                </div>
            </dl>
        </>
    );
}