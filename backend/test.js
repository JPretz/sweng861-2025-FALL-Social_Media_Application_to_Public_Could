// test.js
import fetch from 'node-fetch';

async function test() {
  try {
    // Test health check
    const pingRes = await fetch('http://localhost:8080/api/ping');
    const pingData = await pingRes.json();
    console.log('Ping:', pingData);

    // Test getting posts
    const postsRes = await fetch('http://localhost:8080/api/posts');
    const postsData = await postsRes.json();
    console.log('Posts:', postsData);
  } catch (err) {
    console.error('Error testing backend:', err);
  }
}

test();
