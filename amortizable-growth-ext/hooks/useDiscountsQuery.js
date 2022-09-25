import React from 'react';
import {
    useQuery,
} from '@tanstack/react-query';
import { fetchDiscounts } from 'api';

export function useDiscountsQuery() {
    const { isLoading, isError, data: discounts, error } = useQuery(['discounts'], fetchDiscounts);

    return {
        isLoading,
        isError,
        error,
        discounts
    }
}