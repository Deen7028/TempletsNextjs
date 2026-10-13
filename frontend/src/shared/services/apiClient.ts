import Cookies from "js-cookie";
import { getApiErrorMessage } from "./apiMessage";

export interface IApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  authTokenCookieName?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  allowedHosts?: string[];
  onAlert?: (status: number, message: string) => void;
}

export interface IRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private authTokenCookieName: string;
  private xsrfCookieName: string;
  private xsrfHeaderName: string;
  private allowedHosts: string[];
  private onAlert?: (status: number, message: string) => void;
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  constructor(config: IApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    this.timeout = config.timeout || 30000; // 30s default
    this.authTokenCookieName = config.authTokenCookieName || "accessToken";
    this.xsrfCookieName = config.xsrfCookieName || "XSRF-TOKEN";
    this.xsrfHeaderName = config.xsrfHeaderName || "X-Csrf-Token";
    this.allowedHosts = config.allowedHosts || ["*"];
    this.onAlert = config.onAlert;
  }

  private isHostAllowed(url: string): boolean {
    if (this.allowedHosts.includes("*")) return true;
    try {
      const parsed = new URL(url, "http://dummy");
      const host = parsed.hostname;
      return this.allowedHosts.some((allowed) => {
        if (allowed.startsWith("*.")) {
          const domain = allowed.slice(2);
          return host.endsWith(domain);
        }
        return host === allowed;
      });
    } catch {
      return true;
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timer);

      // Retry on 502, 503, 504
      if ([502, 503, 504].includes(res.status) && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, (4 - retries) * 1000));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      return res;
    } catch (err: unknown) {
      if (retries > 0 && !(err instanceof DOMException && err.name === "AbortError")) {
        await new Promise((resolve) => setTimeout(resolve, (4 - retries) * 1000));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw err;
    }
  }

  public async request<T = unknown>(endpoint: string, options: IRequestOptions = {}): Promise<T> {
    const isFullUrl = endpoint.startsWith("http://") || endpoint.startsWith("https://");
    const fullUrlStr = isFullUrl
      ? endpoint
      : `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    if (!this.isHostAllowed(fullUrlStr)) {
      throw new Error(`Host not allowed by ApiClient whitelist: ${fullUrlStr}`);
    }

    const urlObj = new URL(fullUrlStr, "http://dummy");
    if (options.params) {
      Object.entries(options.params).forEach(([k, v]) => {
        if (v !== undefined) {
          urlObj.searchParams.append(k, String(v));
        }
      });
    }

    const targetUrl = isFullUrl ? urlObj.toString() : urlObj.pathname + urlObj.search;
    const finalUrl = isFullUrl ? targetUrl : `${this.baseUrl.replace(/\/$/, "")}${targetUrl}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (!options.skipAuth && typeof window !== "undefined") {
      const token = Cookies.get(this.authTokenCookieName);
      if (token && !headers["Authorization"]) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const xsrf = Cookies.get(this.xsrfCookieName);
      if (xsrf && !headers[this.xsrfHeaderName]) {
        headers[this.xsrfHeaderName] = xsrf;
      }
    }

    const method = (options.method || "GET").toUpperCase();
    const isGet = method === "GET";

    // Deduplication for GET
    if (isGet) {
      const existing = this.pendingRequests.get(finalUrl);
      if (existing) {
        return existing as Promise<T>;
      }
    }

    const requestPromise = (async () => {
      try {
        const response = await this.fetchWithRetry(finalUrl, {
          ...options,
          headers,
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          let parsedError: Record<string, unknown> = {};
          try {
            parsedError = JSON.parse(errorText);
          } catch {
            // non-json body
          }

          const errMsg = getApiErrorMessage(
            response.status,
            (parsedError.message as string) || (parsedError.error as string) || errorText
          );

          if (this.onAlert) {
            this.onAlert(response.status, errMsg);
          }

          if (response.status === 401 && typeof window !== "undefined") {
            if (!window.location.pathname.includes("/login")) {
              window.location.href = "/login";
            }
          }

          throw new Error(errMsg);
        }

        const text = await response.text();
        return (text ? JSON.parse(text) : {}) as T;
      } finally {
        if (isGet) {
          this.pendingRequests.delete(finalUrl);
        }
      }
    })();

    if (isGet) {
      this.pendingRequests.set(finalUrl, requestPromise);
    }

    return requestPromise;
  }

  public get<T = unknown>(endpoint: string, options: IRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T = unknown>(endpoint: string, data?: unknown, options: IRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  public put<T = unknown>(endpoint: string, data?: unknown, options: IRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  public delete<T = unknown>(endpoint: string, options: IRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  public async downloadFile(endpoint: string, filename: string): Promise<void> {
    const res = await this.fetchWithRetry(
      `${this.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }
}

export const apiClient = new ApiClient();

export const apiClientExternal = new ApiClient({
  allowedHosts: ["localhost", "api.pea.co.th", "*.internal.pea.co.th"],
});
