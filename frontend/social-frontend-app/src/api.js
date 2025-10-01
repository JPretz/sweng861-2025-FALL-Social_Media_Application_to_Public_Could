const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";

let authToken = null;
export function setToken(token) {
  authToken = token;
}

export async function getPosts() {
  try {
    const res = await fetch(`${BACKEND_URL}/posts`, {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [{ id: 0, content: `API not reachable: ${err.message}`, username: 'N/A' }];
  }
}

export async function login(username, password) {
  try {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Login failed: ${res.status} ${res.statusText} - ${msg}`);
    }
    const data = await res.json();
    if (data.success) setToken(data.token);
    return data;
  } catch (err) {
    console.error(err);
    return { success: false, token: '', error: `Login error: ${err.message}` };
  }
}

export async function createPost(content) {
  try {
    const res = await fetch(`${BACKEND_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Post creation failed: ${res.status} ${res.statusText} - ${msg}`);
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    return { error: `Could not create post: ${err.message}` };
  }
}
