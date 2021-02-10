export interface Token {
    username: string;
    email: string;
    roles?: Array<string>;
    iat?: number;
    exp?: number;
}