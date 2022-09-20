import { useAuthenticatedFetch } from "./useAuthenticatedFetch";
import { useMutation } from "react-query";

export const useAppMutation = ({ url, fetchInit = {}, reactMutationOptions }) => {
    const authenticatedFetch = useAuthenticatedFetch();
    const fetch = async (payload) => {
        const response = await authenticatedFetch(url, {
            ...fetchInit,
            body: JSON.stringify(payload),
        });
        return response.json();
    }

    return useMutation(url, fetch, {
        ...reactMutationOptions,
        retry: 1,
    });
};