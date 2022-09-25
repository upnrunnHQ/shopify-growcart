export async function fetchDiscounts() {
    const response = await fetch('/apps/growcart/api/rewards', {
        headers: {
            'ngrok-skip-browser-warning': 'skip'
        },
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}