import React from 'react';
import clsx from 'clsx';

function Icon({ children, className, viewBox = '0 0 20 20', fill = 'currentColor', stroke, ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={viewBox}
            {...props}
            fill={fill}
            stroke={stroke}
            className={clsx('w-5 h-5', className)}
        >
            {children}
        </svg>
    );
}

export function IconRemove(props) {
    return (
        <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
            <title>Remove</title>
            <path
                d="M4 6H16"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M5.5 6L6 17H14L14.5 6"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
                strokeWidth="1.25"
            />
        </Icon>
    );
}

export function IconStar(props) {
    return (
        <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
            <title>Star</title>
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
        </Icon>
    );
}

export function IconLock(props) {
    return (
        <Icon {...props} fill="transparent" stroke={props.stroke || 'currentColor'}>
            <title>Lock</title>
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
        </Icon>
    );
}

export function IconCart(props) {
    return (
        <Icon {...props} viewBox="0 0 16 16" fill="transparent" stroke={props.stroke || 'currentColor'}>
            <title>Cart</title>
            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
        </Icon>
    );
}
