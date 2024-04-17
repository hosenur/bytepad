import useSWR from "swr";
import { useURL } from "./useURL";
import Axios from 'axios'
import { useAuth } from "@clerk/clerk-react";

const usePlaygrounds = () => {
    const { getToken } = useAuth()
    const fetcher = async (url: string) => {
        return Axios.get(url, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        }).then(res => res.data)
    }
    const getMyPlaygrounds = () => {
        const url = useURL("playgrounds");
        const { data } = useSWR(url, fetcher);
        return {
            data
        }
    }
    return { getMyPlaygrounds };
}
export { usePlaygrounds };