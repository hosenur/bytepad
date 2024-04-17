import useSWR from 'swr';
import { useAuth } from '@clerk/clerk-react';

export default function useAuthSWR(url: string) {
    const { getToken } = useAuth();

    const fetcher = async (...args: [RequestInfo]) => {
        return fetch(...args, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        }).then(res => res.json());
    };

    return useSWR(url, fetcher);
}