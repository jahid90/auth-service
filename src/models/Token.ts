export interface Token {
    username: string;
    email?: string;
    roles?: Array<string>;
    tokenVersion?: number;
    iat?: number;
    exp?: number;
}
