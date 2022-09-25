import React, { useEffect } from 'react';
import { useDiscounts, useCart } from 'hooks';
import { IconStar, IconLock } from 'components';

export function Rewards() {
    const {
        discounts,
        currentRewards,
        nextRewards,
        rewardsProgress,
        hint
    } = useDiscounts();
    const {
        cart
    } = useCart();

    if (discounts.length === 0) {
        return null;
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
        });
    }, [cart]);

    return (
        <div className="Rewards CartDetails__Rewards">
            <div className="Rewards__list">
                <span className="Rewards__list-title">Rewards</span>
                {currentRewards.length || nextRewards.length ? (
                    <ul>
                        {!!currentRewards.length && currentRewards.map((reward, index) => (
                            <li key={index} className="Rewards__item availed">
                                <span className="Rewards__icon">
                                    <IconStar />
                                </span>
                                <span
                                    className="Rewards__text"
                                    dangerouslySetInnerHTML={{ __html: reward.title }}
                                ></span>
                            </li>
                        ))}

                        {!!nextRewards.length && nextRewards.map((reward, index) => (
                            <li key={index} className="Rewards__item">
                                <span className="Rewards__icon">
                                    <IconLock />
                                </span>
                                <span
                                    className="Rewards__text"
                                    dangerouslySetInnerHTML={{ __html: reward.title }}
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