import useSWR from "swr";
import { useURL } from "./useURL";
import Axios from 'axios'
import { useAuth } from "@clerk/clerk-react";
import useAuthAxios from "./useAutrhAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const usePlaygrounds = () => {
    const { getToken } = useAuth()
    const navigate = useNavigate()
    const AuthAxios = useAuthAxios()
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
    const createPlayground = (type: string) => {
        const url = useURL("playgrounds");
        toast.promise(AuthAxios.post(url, { type }), {
            loading: 'Creating playground',
            success: (res) => {
                navigate(`/playground/${res.data.name}`);
                return 'Playground created';
            },
            error: 'Error',
        });
    }
    return { getMyPlaygrounds, createPlayground };
}
export { usePlaygrounds };