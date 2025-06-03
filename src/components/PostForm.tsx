// src/components/PostForm.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post, PostData } from '../services/postService';
import { getPostById, createPost, updatePost } from '../services/postService';

interface PostFormProps {
  isEditMode?: boolean;
}

const PostForm: React.FC<PostFormProps> = ({ isEditMode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchPostData = async () => {
        setLoading(true);
        try {
          const post = await getPostById(id);
          setTitle(post.title);
          setContent(post.content);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch post data');
        } finally {
          setLoading(false);
        }
      };
      fetchPostData();
    }
  }, [id, isEditMode]);

  const validateForm = (): boolean => {
    if (!title.trim()) {
      setFormError('Title cannot be empty.');
      return false;
    }
    if (!content.trim()) {
      setFormError('Content cannot be empty.');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    const postData: PostData = { title, content };

    try {
      let savedPost: Post;
      if (isEditMode && id) {
        savedPost = await updatePost(id, postData);
        alert('Post updated successfully!');
      } else {
        savedPost = await createPost(postData);
        alert('Post created successfully!');
      }
      navigate(`/posts/${savedPost.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && id) {
    return <p>Loading post data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="post-form-container">
      <h2>{isEditMode ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        {formError && <p className="form-error">{formError}</p>}
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Post' : 'Create Post')}
        </button>
        <button type="button" onClick={() => navigate(isEditMode && id ? `/posts/${id}` : '/')} disabled={loading} className="cancel-button">
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PostForm;
