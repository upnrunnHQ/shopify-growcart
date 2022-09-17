import React, { useEffect } from 'react';
import { useCart } from 'hooks';
import { IconStar, IconLock } from 'components';

function getRewardsProgress(cart, gettingMostRewards, quantityList) {
    if (gettingMostRewards) {
        return 100;
    }

    if (cart.item_count && quantityList.length) {
        return (cart.item_count / Math.max(quantityList)) * 100;
    }

    return 0;
}


export function Rewards() {
    const {
        cart
    } = useCart();
    const reward = {
        name: 'Cart threshold incentives (by quantity)',
        type: 'minimum_cart_quantity',
        rules: [
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12a',
                name: '10% Off',
                type: 'percent',
                value: 10,
                quantity: 2,
                hint: 'Add {{quantity}} more to get {{name}}',
                enabled: true,
            },
            {
                id: '3e6f0d87-bbd1-49f4-a0c0-7f58b665c12a',
                name: '20% Off',
                type: 'percent',
                value: 20,
                quantity: 5,
                hint: 'Add {{quantity}} more to get {{name}}',
                enabled: true,
            }
        ]
    };

    if (reward.rules.length === 0) {
        return null;
    }

    let hint = '';
    const currentRewards = cart.item_count ? reward.rules.filter(rule => rule.quantity <= cart.item_count) : reward.rules;
    const nextRewards = cart.item_count ? reward.rules.filter(rule => rule.quantity > cart.item_count) : [];
    const gettingMostRewards = cart.item_count ? currentRewards.length && (currentRewards.length === reward.rules.length) : false;
    const quantityList = cart.item_count ? reward.rules.map(rule => rule.quantity) : [];
    const rewardsProgress = getRewardsProgress(cart, gettingMostRewards, quantityList);

    if (gettingMostRewards) {
        hint = 'You\'re getting the most rewards!';
    } else if (nextRewards.length) {
        console.log(nextRewards);
        console.log(nextRewards[0].hint);
        hint = nextRewards[0].hint;
        hint.replace('{{quantity}}', nextRewards[0].quantity - cart.item_count);
        hint.replace('{{name}}', nextRewards[0].name);
    }

    useEffect(() => {
        const slider = document.querySelector('.Rewards__list ul');
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 3; //scroll-fast
            slider.scrollLeft = scrollLeft - walk;
            console.log(walk);
        });
    }, [cart]);

    return (
        <div className="Rewards">
            <div className="Rewards__list">
                <span className="Rewards__list-title">Rewards</span>
                {currentRewards.length || nextRewards.length ? (
                    <ul>
                        {currentRewards.length && currentRewards.map((reward, index) => (
                            <li key={index} className="Rewards__item availed">
                                <span className="Rewards__icon">
                                    <IconStar />
                                </span>
                                <span
                                    className="Rewards__text"
                                    dangerouslySetInnerHTML={{ __html: reward.name }}
                                ></span>
                            </li>
                        ))}

                        {nextRewards.length && nextRewards.map((reward, index) => (
                            <li key={index} className="Rewards__item">
                                <span className="Rewards__icon">
                                    <IconLock />
                                </span>
                                <span
                                    className="Rewards__text"
                                    dangerouslySetInnerHTML={{ __html: reward.name }}
                                ></span>
                            </li>
                        ))}
                    </ul>
                ) : null}

            </div>


            <div className="Rewards__progress">
                <div className="Rewards__progress-wrap">
                    <div className="progress">
                        <div
                            className="progress__bar"
                            style={{
                                width: `${rewardsProgress}%`,
                            }}
                        ></div>
                    </div>

                    <span
                        dangerouslySetInnerHTML={{ __html: hint }}
                    ></span>
                </div>
            </div>
        </div>
    );
}