// Optional TypeScript type definitions for http-wrapper

export type ResponseType = 'json' | 'text' | 'blob' | 'formdata' | 'arrayBuffer' | 'arraybuffer';

export type HttpOptions = RequestInit & {
  headers?: Record<string, string>;
};

export interface HttpWrapper {
  httpGET<T = any>(url: string, type?: ResponseType, options?: HttpOptions): Promise<T>;
  httpPOST<T = any>(url: string, body: any, type?: ResponseType, options?: HttpOptions): Promise<T>;
  httpPUT<T = any>(url: string, body: any, type?: ResponseType, options?: HttpOptions): Promise<T>;
  httpPATCH<T = any>(url: string, body: any, type?: ResponseType, options?: HttpOptions): Promise<T>;
  httpDELETE<T = any>(url: string, type?: ResponseType, options?: HttpOptions): Promise<T>;
}

// Usage example with strict typing:
// const posts: Post[] = await httpGET<Post[]>('/api/posts');
// const user: User = await httpPOST<User>('/api/users', userData);