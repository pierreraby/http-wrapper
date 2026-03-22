# HTTP Wrapper

This is a simple HTTP wrapper that provides a convenient way to make HTTP requests in your projects.

The wrapper automatically JSON-serializes plain objects and arrays, leaves `FormData` and other non-JSON bodies untouched, and throws a structured `HttpError` when the server answers with a non-2xx status.

## JavaScript example

Run:

```bash
npm start
```

The JavaScript demo lives in [index.js](./index.js).

## TypeScript example

Run:

```bash
npm run startTS
```

The TypeScript demo lives in [index.ts](./index.ts) and uses typed payloads and responses.

## Tests

Run:

```bash
npm test
```

```ts
import {
	HttpError,
	httpDELETE,
	httpGET,
	httpPATCH,
	httpPOST,
	httpPUT,
} from "./http.js";

interface Post {
	id: number;
	title: string;
	body: string;
	userId: number;
}

interface CreatePostPayload {
	title: string;
	body: string;
	userId: number;
}

const API_URL = "https://jsonplaceholder.typicode.com/posts";

const posts = await httpGET<Post[]>(API_URL);

const newPost = await httpPOST<Post, CreatePostPayload>(API_URL, {
	title: "My New Post",
	body: "This is the content of my new post",
	userId: 1,
});

const updatedPost = await httpPUT<Post, Post>(`${API_URL}/1`, {
	id: 1,
	title: "Updated Post Title",
	body: "This post has been completely updated",
	userId: 1,
});

const patchedPost = await httpPATCH<Post, Partial<Post>>(`${API_URL}/1`, {
	title: "Patched Title Only",
});

const deleteResult = await httpDELETE<Record<string, never>>(`${API_URL}/1`);
const textResponse = await httpGET<string>(`${API_URL}/1`, "text");

try {
	await httpGET(`${API_URL}/does-not-exist`);
} catch (error) {
	if (error instanceof HttpError) {
		console.error(error.status, error.body);
	}
}
```


