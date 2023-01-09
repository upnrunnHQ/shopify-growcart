import React, { useRef } from 'react';
import { useScroll } from 'react-use';
import {
    CartLineProvider,
} from '@shopify/hydrogen';
import { useCart } from 'hooks';
import {
    Rewards,
    CartLineItem,
    CartEmpty,
    OrderSummary,
    CartCheckoutActions,
    Recommendations
} from 'components';
import brandLogo from './../../img/brand-logo.png';

export function CartDetails() {
    const { cart } = useCart();
    const scrollRef = useRef(null);
    const { y } = useScroll(scrollRef);

    if (cart.items.length === 0) {
        return <CartEmpty onClose={() => { }} />;
    }

    return (
        <div className="CartDetails">
            <section
                ref={scrollRef}
                className="CartDetails__cart-contents"
            >
                <Rewards />
                <ul className="CartLines CartDetails__CartLines">
                    {cart.items.map((line) => {
                        return (
                            <CartLineProvider key={line.id} line={line}>
                                <CartLineItem />
                            </CartLineProvider>
                        );
                    })}
                </ul>
                {!!cart.items.length && <Recommendations />}
            </section>
            <section className='CartDetails__summary'>
                <OrderSummary />
                <CartCheckoutActions />
                <a href="https://glice.co/business/growcart" title="Powered by Glice" target="_blank">
                    <img className='brandLogo' src={brandLogo} />
                </a>
            </section>
        </div>
    );
}