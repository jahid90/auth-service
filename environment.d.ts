import { JsonWebTokenError } from "jsonwebtoken";

declare global {
    namespace NodeJS {
        export interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;
            MONGO_USER: string;
            MONGO_PASSWORD: string;
            MONGO_HOST: string;
            MONGO_PORT: string;
            MONGO_DATABASE: string;
            JWT_SECRET: string;
        }
    }
}

export {}
