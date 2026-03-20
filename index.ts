import { httpDELETE, httpGET, httpPATCH, httpPOST, httpPUT } from "./http.js";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

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

interface UpdatePostPayload extends CreatePostPayload {
	id: number;
}

interface PatchPostPayload {
	title?: string;
	body?: string;
	userId?: number;
}

async function demonstrateHttpWrapper(): Promise<void> {
	console.log("🚀 HTTP Wrapper Demo TypeScript\n");

	try {
		console.log("📥 GET - Fetching all posts...");
		const posts = await httpGET<Post[]>(API_URL);
		console.log(`Found ${posts.length} posts\n`);

		console.log("📤 POST - Creating new post...");
		const newPost = await httpPOST<Post, CreatePostPayload>(API_URL, {
			title: "My New Post",
			body: "This is the content of my new post",
			userId: 1,
		});
		console.log("Created post:", newPost, "\n");

		console.log("✏️  PUT - Updating post...");
		const updatedPost = await httpPUT<Post, UpdatePostPayload>(`${API_URL}/1`, {
			id: 1,
			title: "Updated Post Title",
			body: "This post has been completely updated",
			userId: 1,
		});
		console.log("Updated post:", updatedPost, "\n");

		console.log("🔧 PATCH - Partially updating post...");
		const patchedPost = await httpPATCH<Post, PatchPostPayload>(`${API_URL}/1`, {
			title: "Patched Title Only",
		});
		console.log("Patched post:", patchedPost, "\n");

		console.log("🗑️  DELETE - Deleting post...");
		const deleteResult = await httpDELETE<Record<string, never>>(`${API_URL}/1`);
		console.log("Delete result:", deleteResult, "\n");

		console.log("📄 GET as text...");
		const textResponse = await httpGET<string>(`${API_URL}/1`, "text");
		console.log("Text response:", textResponse);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.error("❌ Error occurred:", message);
	}
}

demonstrateHttpWrapper();
