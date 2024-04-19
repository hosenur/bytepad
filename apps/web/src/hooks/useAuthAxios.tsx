import Axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
export default function useAuthAxios() {
    const { getToken } = useAuth()
    const AuthAxios = Axios.create();

    AuthAxios.interceptors.request.use(async config => {
        config.headers.Authorization = `Bearer ${await getToken()}`;
        return config;
    });

    return AuthAxios;
}