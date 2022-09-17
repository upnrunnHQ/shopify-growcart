import React from 'react';
import { useCart } from 'hooks';
import { Text, Money } from 'components';

export function OrderSummary() {
    const { cart } = useCart();
    const { items_subtotal_price, currency } = cart;
    const totalSaving = cart.total_discount ? <Money data={{ amount: String(cart.total_discount), currencyCode: currency }} /> : null;

    return (
        <>
            <dl className="OrderSummary">
                {totalSaving && (
                    <div className="OrderSummary__item">
                        <Text as="dt">Rewards</Text>
                        <Text as="dd">
                            You are saving {totalSaving}
                        </Text>
                    </div>
                )}

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