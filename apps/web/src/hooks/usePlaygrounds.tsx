import useSWR, { useSWRConfig } from "swr";
import { useURL } from "./useURL";
import Axios from 'axios'
import { useAuth } from "@clerk/clerk-react";
import useAuthAxios from "./useAuthAxios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const usePlaygrounds = () => {
    const { getToken } = useAuth()
    const { mutate } = useSWRConfig()
    const navigate = useNavigate()
    const AuthAxios = useAuthAxios()
    const fetcher = async (url: string) => {
        return Axios.get(url, {
            headers: { Authorization: `Bearer ${await getToken()}` }
        }).then(res => res.data)
    }
    const getMyPlaygrounds = () => {
        const url = useURL("playgrounds");
        const { data, isLoading } = useSWR(url, fetcher);
        return {
            data,
            isLoading
        }
    }
    const deletePlayground = (tag: string) => {
        const url = useURL(`playgrounds/${tag}`);
        toast.promise(AuthAxios.delete(url), {
            loading: 'Deleting playground',
            success: 'Playground deleted',
            error: 'Error'
        });
        navigate("/playgrounds");
        mutate("/playgrounds")
    }
    const createPlayground = (framework: string) => {
        const url = useURL("playgrounds");
        toast.promise(AuthAxios.post(url, { framework }), {
            loading: 'Creating playground',
            success: (res) => {
                navigate(`/playground/${res.data.tag}`);
                return 'Playground created';
            },
            error: 'Error',
        });
    }
    return { getMyPlaygrounds, createPlayground, deletePlayground };
}
export { usePlaygrounds };