export interface Token {
    username: string;
    email: string;
    iat?: number;
    exp?: number;
}