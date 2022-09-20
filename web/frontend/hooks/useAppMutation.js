import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useMemo } from "react";
import { useMutation } from "react-query";

export const useAppMutation = ({ url, fetchInit = {}, reactMutationOptions }) => {
    const authenticatedFetch = useAuthenticatedFetch();
    const fetch = useMemo(() => {
        return async () => {
            const response = await authenticatedFetch(url, fetchInit);
            return response.json();
        };
    }, [url, JSON.stringify(fetchInit)]);

    return useMutation(url, fetch, {
        ...reactMutationOptions,
        retry: 1,
    });
};