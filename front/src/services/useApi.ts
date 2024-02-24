import {useNavigate} from "react-router-dom";
import {tokenKey} from "../models/jwt.model";

const useApi = () => {
    const baseUrl = "http://localhost:8080";
    const navigate = useNavigate();

    return async (url: string, options: RequestInit = {}) => {

        const type = 'application/json';
        const headers = new Headers(options.headers);
        headers.set('Content-Type', type);
        headers.set('Accept', type);

        const token = localStorage.getItem(tokenKey);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const response = await fetch(`${baseUrl}/${url}`, {...options, headers});

        if (response.ok) {
            // check if it's a 204 response
            if (response.status === 204) {
                return;
            }
            return response.json();
        }

        if ([401, 403].includes(response.status)) {
            localStorage.removeItem(tokenKey);
            navigate('/login');
            return;
        }

        console.log(response);
        const error = await response.json();
        throw new Error(error.detail ?? response.statusText ?? "An error occurred");
    }
};

export default useApi;