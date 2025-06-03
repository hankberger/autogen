// src/components/PostList.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../services/postService';
import { getAllPosts } from '../services/postService';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getAllPosts();
        setPosts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="post-list-container">
      <h2>Blog Posts</h2>
      <Link to="/create-post" className="create-post-link">
        Create New Post
      </Link>
      {posts.length === 0 ? (
        <p>No posts yet. Be the first to create one!</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="post-item">
              <h3>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p>{post.content.substring(0, 100)}...</p>
              <small>Created at: {new Date(post.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostList;
