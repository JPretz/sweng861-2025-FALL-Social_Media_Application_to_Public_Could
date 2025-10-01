import React, { useEffect, useState } from 'react';

function App() {
  const [loginStatus, setLoginStatus] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'user1', password: 'password' })
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setLoginStatus("Login successful!");
        fetchPosts(data.token);
      } else {
        setLoginStatus("Login failed");
      }
    } catch (err) {
      setError("Login request failed");
    }
  };

  const fetchPosts = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError("Failed to fetch posts");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoginStatus("Already logged in");
      fetchPosts(token);
    }
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "50px" }}>
      <h1>🚀 Social Media App (Frontend)</h1>

      {!loginStatus && <button onClick={login}>Login</button>}
      {loginStatus && <p>{loginStatus}</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Posts:</h2>
      {posts.length > 0 ? (
        <ul>
          {posts.map(post => (
            <li key={post.id}><strong>{post.title}:</strong> {post.content}</li>
          ))}
        </ul>
      ) : (
        <p>No posts to show</p>
      )}
    </div>
  );
}

export default App;
