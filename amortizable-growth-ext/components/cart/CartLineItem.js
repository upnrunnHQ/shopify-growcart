import React from 'react';
import { useCart, useCartLine } from 'hooks';
import {
    Heading,
    IconRemove,
    Text,
    Money,
    CartLineQuantity,
    CartLineQuantityAdjustButton
} from 'components';

export function CartLineItem() {
    const { isLoading, lineUpdate } = useCart();
    const {
        id: lineId,
        key,
        product_title,
        url,
        featured_image,
        quantity,
        final_line_price,
        currency
    } = useCartLine();

    return (
        <li key={lineId} className="CartLineItem">
            {featured_image.url && (
                <div className="CartLineItem__image">
                    <img src={featured_image.url} />
                </div>
            )}


            <div className="CartLineItem__content">
                <div>
                    <Heading as="h3" size="copy">
                        <a hre={url}>{product_title}</a>
                    </Heading>

                    <div className="CartLineItem__quantity">
                        <CartLineQuantityAdjust lineId={lineId} quantity={quantity} />

                        <button
                            type="button"
                            onClick={() => lineUpdate({ id: key, quantity: 0 })}
                            className="CartLineItem__remove button button--tertiary"
                            disabled={isLoading}
                        >
                            <IconRemove aria-hidden="true" />
                        </button>
                    </div>
                </div>
                <Text>
                    <Money data={{ amount: String(final_line_price), currencyCode: currency }} />
                </Text>
            </div>
        </li>
    );
}

function CartLineQuantityAdjust({ lineId, quantity }) {
    return (
        <div className="CartLineItem__quantity-adjust quantity">
            <CartLineQuantityAdjustButton
                adjust="decrease"
                aria-label="Decrease quantity"
                className="quantity__button"
            >
                &#8722;
            </CartLineQuantityAdjustButton>
            <CartLineQuantity as="div" className="quantity__input" />
            <CartLineQuantityAdjustButton
                adjust="increase"
                aria-label="Increase quantity"
                className="quantity__button"
            >
                &#43;
            </CartLineQuantityAdjustButton>
        </div>
    );
}
