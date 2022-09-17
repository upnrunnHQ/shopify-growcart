export async function fetchCartContents() {
    const response = await fetch(window.Shopify.routes.root + 'cart.js');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

export async function updateLineItem(line) {
    const response = await fetch(window.Shopify.routes.root + 'cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...line,
            sections: ['cart-icon-bubble']
        })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}