import React from 'react';
import { useDiscounts } from 'hooks';
import { IconStar, IconLock } from 'components';

export function Rewards() {
    const {
        discounts,
        currentRewards,
        nextRewards,
        rewardsProgress,
        hint
    } = useDiscounts();

    if (discounts.length === 0) {
        return null;
    }

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