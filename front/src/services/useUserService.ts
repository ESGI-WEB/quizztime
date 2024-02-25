import useApi from './useApi';
import {User, UserPost} from "../models/user.model";
import {jwtDecode} from "jwt-decode";
import {JWTToken, tokenKey} from "../models/jwt.model";
import {socket} from "../socket";

const useUserService = () => {
    const api = useApi();
    return {
        post: (body: UserPost): Promise<User> => api(`users`, {
            method: 'POST',
            body: JSON.stringify(body),
        }),
        currentUser: () => {
            const token = localStorage.getItem(tokenKey);
            if (!token) {
                return null;
            }
            return jwtDecode(token) as JWTToken;
        },
        login: (email: string, password: string): Promise<{ token: string }> => api(`login`, {
            method: 'POST',
            body: JSON.stringify({email, password}),
        }),
        logout: () => {
            if (socket.connected) {
                socket.disconnect();
            }
            localStorage.removeItem(tokenKey);
        }
    };
};

export default useUserService;
