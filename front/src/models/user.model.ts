export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    token?: string;
}

export interface UserPost {
    email: string;
    password: string;
    name: string;
}