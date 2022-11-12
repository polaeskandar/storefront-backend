import dotenv from "dotenv";
dotenv.config();

export const APP_PORT: number | undefined = (process.env.APP_PORT as unknown as number) || undefined;
export const APP_SECRET: string | undefined = (process.env.APP_SECRET as string) || undefined;
export const ENV: string | undefined = (process.env.ENV as string) || undefined;
export const SALT_ROUNDS: number = 10;

export const DATABASE_NAME: string | undefined = process.env.DATABASE_NAME || undefined;
export const DATABASE_USERNAME: string | undefined = process.env.DATABASE_USERNAME || undefined;
export const DATABASE_PASSWORD: string | undefined = process.env.DATABASE_PASSWORD || undefined;
export const DATABASE_PORT: number | undefined = (process.env.DATABASE_PORT as unknown as number) || undefined;

export const TESTING_DATABASE_NAME: string | undefined = process.env.TESTING_DATABASE_NAME || undefined;
export const TESTING_DATABASE_USERNAME: string | undefined = process.env.TESTING_DATABASE_USERNAME || undefined;
export const TESTING_DATABASE_PASSWORD: string | undefined = process.env.TESTING_DATABASE_PASSWORD || undefined;
export const TESTING_DATABASE_PORT: number | undefined = (process.env.TESTING_DATABASE_PORT as unknown as number) || undefined;
