import React from 'react';
import { useCart } from 'hooks';

export function CartCheckoutActions() {
    const {
        setDisplayCart
    } = useCart();

    return (
        <>
            <div className="CartCheckoutActions">
                <form action="/cart" method="post" id="growcarthq__checkout-form">
                    <button className="button button--primary button--full-width" name="checkout">Check out</button>
                </form>
                <button
                    type="button"
                    className="link button-label"
                    onClick={() => setDisplayCart(false)}
                >
                    Continue shopping
                </button>
            </div>
        </>
    );
}