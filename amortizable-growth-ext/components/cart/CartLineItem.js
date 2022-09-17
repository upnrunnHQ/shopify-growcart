import React from 'react';
import {
    useCartLine,
    CartLineQuantity,
} from '@shopify/hydrogen';
import { useCart } from 'hooks';
import {
    Heading,
    IconRemove,
    Text,
    Money,
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
                <div className="grid gap-2">
                    <Heading as="h3" size="copy">
                        <a hre={url}>{product_title}</a>
                    </Heading>

                    <div className="CartLineItem__quantity">
                        <CartLineQuantityAdjust lineId={lineId} quantity={quantity} />

                        <button
                            type="button"
                            onClick={() => lineUpdate({ id: key, quantity: 0 })}
                            className="CartLineItem__remove"
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
        <>
            <div className="CartLineItem__quantity-adjust">
                <CartLineQuantityAdjustButton
                    adjust="decrease"
                    aria-label="Decrease quantity"
                    className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
                >
                    &#8722;
                </CartLineQuantityAdjustButton>
                <CartLineQuantity as="div" className="px-2 text-center" />
                <CartLineQuantityAdjustButton
                    adjust="increase"
                    aria-label="Increase quantity"
                    className="w-10 h-10 transition text-primary/50 hover:text-primary disabled:cursor-wait"
                >
                    &#43;
                </CartLineQuantityAdjustButton>
            </div>
        </>
    );
}
