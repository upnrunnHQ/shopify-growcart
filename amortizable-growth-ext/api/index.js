export async function fetchDiscounts() {
    const response = await fetch('/apps/growcart/api/rewards');

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}