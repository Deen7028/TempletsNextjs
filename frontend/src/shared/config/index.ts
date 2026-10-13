export * from "./navigation";

export interface IAppConfig {
  apiUrl: string;
  allowInsecureSsl: boolean;
  sentryDsn?: string;
}

export const appConfig: IAppConfig = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  allowInsecureSsl: process.env.ALLOW_INSECURE_SSL === "true",
  sentryDsn: process.env.SENTRY_DSN,
};
