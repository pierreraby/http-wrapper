import { httpDELETE, httpGET, httpPATCH, httpPOST, httpPUT } from "./http.js";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Example usage of the HTTP wrapper
async function demonstrateHttpWrapper() {
  console.log("🚀 HTTP Wrapper Demo\n");

  try {
    // GET request - fetch all posts
    console.log("📥 GET - Fetching all posts...");
    const posts = await httpGET(API_URL);
    console.log(`Found ${posts.length} posts\n`);

    // POST request - create new post
    console.log("📤 POST - Creating new post...");
    const newPost = await httpPOST(API_URL, {
      title: "My New Post",
      body: "This is the content of my new post",
      userId: 1
    });
    console.log("Created post:", newPost, "\n");

    // PUT request - update entire post
    console.log("✏️  PUT - Updating post...");
    const updatedPost = await httpPUT(`${API_URL}/1`, {
      id: 1,
      title: "Updated Post Title",
      body: "This post has been completely updated",
      userId: 1
    });
    console.log("Updated post:", updatedPost, "\n");

    // PATCH request - partial update
    console.log("🔧 PATCH - Partially updating post...");
    const patchedPost = await httpPATCH(`${API_URL}/1`, {
      title: "Patched Title Only"
    });
    console.log("Patched post:", patchedPost, "\n");

    // DELETE request
    console.log("🗑️  DELETE - Deleting post...");
    const deleteResult = await httpDELETE(`${API_URL}/1`);
    console.log("Delete result:", deleteResult, "\n");

    // Example with different response type (text)
    console.log("📄 GET as text...");
    const textResponse = await httpGET(`${API_URL}/1`, 'text');
    console.log("Text response:", textResponse);

  } catch (error) {
    console.error("❌ Error occurred:", error.message);
  }
}

// Run the demo
demonstrateHttpWrapper();




