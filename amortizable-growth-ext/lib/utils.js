import typographicBase from 'typographic-base';

export function missingClass(string, prefix) {
    if (!string) {
        return true;
    }

    const regex = new RegExp(` ?${prefix}`, 'g');
    return string.match(regex) === null;
}

export function formatText(input) {
    if (!input) {
        return;
    }

    if (typeof input !== 'string') {
        return input;
    }

    return typographicBase(input, { locale: 'en-us' }).replace(
        /\s([^\s<]+)\s*$/g,
        '\u00A0$1',
    );
}

export function getRewardsProgress(amountOrQuantity, gettingMostRewards, max) {
    if (gettingMostRewards) {
        return 100;
    }

    if (amountOrQuantity && max) {
        return (amountOrQuantity / max) * 100;
    }

    return 0;
}

export function dummyData() {
    return {
        minimumRequiremenType: 'QUANTITY',
        discounts: [
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12a',
                title: '10% Off',
                type: 'percent',
                value: 10,
                amountOrQuantity: 2,
                hint: 'Add {{quantity}} more to get {{title}}',
                enabled: true,
            },
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12',
                title: '20% Off',
                type: 'percent',
                value: 20,
                amountOrQuantity: 5,
                hint: 'Add {{quantity}} more to get {{title}}',
                enabled: true,
            }
        ]
    };
}