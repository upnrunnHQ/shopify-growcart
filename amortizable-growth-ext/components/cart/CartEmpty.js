import React from 'react';
import {
    Text
} from 'components';
import { useCart } from 'hooks';

export function CartEmpty() {
    const {
        setDisplayCart
    } = useCart();

    return (
        <section className="CartEmpty">
            <Text format>
                Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
                started!
            </Text>
            <div>
                <button
                    type="button"
                    className="button"
                    onClick={() => setDisplayCart(false)}
                >
                    Continue shopping
                </button>
            </div>
        </section>
    );
}