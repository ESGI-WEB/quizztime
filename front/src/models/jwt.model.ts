export interface JWTToken {
    id: number;
    email: string;
    firstName: string;
    role: string;
}

export const tokenKey = 'quizz-auth-token';