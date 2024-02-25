export interface JWTToken {
    id: number;
    email: string;
    name: string;
    role: string;
}

export const tokenKey = 'quizz-auth-token';