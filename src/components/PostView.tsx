// src/components/PostView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Post } from '../services/postService';
import { getPostById, deletePost } from '../services/postService';

const PostView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Post ID is missing.');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPostById(id);
        setPost(data);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Post not found')) {
          setError('Post not found.');
        } else {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !id) return;
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(id);
        alert('Post deleted successfully!');
        navigate('/'); // Navigate to post list
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete post');
      }
    }
  };

  if (loading) {
    return <p>Loading post...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!post) {
    return <p>Post not found.</p>; // Should be handled by error state but as a fallback
  }

  return (
    <div className="post-view-container">
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={`Image for post titled ${post.title}`}
          className="post-image" // Added a class for potential styling
          style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }} // Basic inline styles
        />
      )}
      <h2>{post.title}</h2>
      <ReactMarkdown>{post.content}</ReactMarkdown>
      <small>Created at: {new Date(post.createdAt).toLocaleString()}</small>
      <div className="post-actions">
        <Link to={`/edit-post/${post.id}`} className="edit-post-link">
          Edit Post
        </Link>
        <button onClick={handleDelete} className="delete-post-button">
          Delete Post
        </button>
      </div>
      <Link to="/" className="back-to-list-link">
        Back to Post List
      </Link>
    </div>
  );
};

export default PostView;
