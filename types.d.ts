// Optional TypeScript type definitions for http-wrapper

export type ResponseType = 'json' | 'text' | 'blob' | 'formdata' | 'arrayBuffer' | 'arraybuffer';

export type HttpOptions = RequestInit & {
  headers?: HeadersInit;
};

export class HttpError extends Error {
  status: number;
  statusText: string;
  url: string;
  body?: unknown;

  constructor(message: string, details: { status: number; statusText: string; url: string; body?: unknown });
}

export function httpGET<TResponse = unknown>(url: string, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
export function httpPOST<TResponse = unknown, TBody = unknown>(url: string, body: TBody, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
export function httpPUT<TResponse = unknown, TBody = unknown>(url: string, body: TBody, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
export function httpPATCH<TResponse = unknown, TBody = unknown>(url: string, body: TBody, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
export function httpDELETE<TResponse = unknown>(url: string, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;

export interface HttpWrapper {
  httpGET<TResponse = unknown>(url: string, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
  httpPOST<TResponse = unknown, TBody = unknown>(url: string, body: TBody, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
  httpPUT<TResponse = unknown, TBody = unknown>(url: string, body: TBody, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
  httpPATCH<TResponse = unknown, TBody = unknown>(url: string, body: TBody, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
  httpDELETE<TResponse = unknown>(url: string, type?: ResponseType, options?: HttpOptions): Promise<TResponse>;
}

// Usage example with strict typing:
// const posts: Post[] = await httpGET<Post[]>('/api/posts');
// const user: User = await httpPOST<User>('/api/users', userData);