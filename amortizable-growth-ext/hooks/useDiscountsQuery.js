import React from 'react';
import {
    useQuery,
} from '@tanstack/react-query';
import { fetchDiscounts } from 'api';

export function useDiscountsQuery() {
    return useQuery(['discounts'], fetchDiscounts)
}