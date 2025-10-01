import React, { useState, useEffect } from 'react';
import { getPosts, login, createPost } from './api';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // store logged-in user info
  const [loginMessage, setLoginMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [error, setError] = useState('');

  // Fetch posts when user logs in
  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      setLoginMessage('Login successful');
      setUser({ username }); // store username
      setUsername('');
      setPassword('');
    } else {
      setLoginMessage('Login failed');
      if (result.error) setError(result.error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPosts([]);
    setLoginMessage('');
    setError('');
  };

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
    if (data.length === 1 && data[0].username === 'N/A') {
      setError(data[0].content);
    } else {
      setError('');
    }
  };

  const handlePost = async () => {
    if (!newPost) return;
    const result = await createPost(newPost);
    if (result.error) {
      setError(result.error);
    } else {
      setPosts([result, ...posts]);
      setNewPost('');
      setError('');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <h1>Social Media App</h1>

      {!user ? (
        <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Login</button>
        </form>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <span>Logged in as: <strong>{user.username}</strong></span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      )}

      <h2>{loginMessage}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Write a post..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            style={{ marginRight: '10px', width: '300px' }}
          />
          <button onClick={handlePost}>Post</button>
        </div>
      )}

      <h2>Posts:</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <strong>{post.username}:</strong> {post.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
