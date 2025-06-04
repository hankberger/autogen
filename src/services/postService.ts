// src/services/postService.ts

const API_BASE_URL = 'http://localhost:3001/api';

export interface Post {
  id: number; // In SQLite, AUTOINCREMENT usually means number
  title: string;
  content: string;
  imageUrl?: string; // Added
  createdAt: string; // ISO date string
}

export interface PostData {
  title: string;
  content: string;
  imageUrl?: string; // Added
}

export const getAllPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const getPostById = async (id: string): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post not found');
    }
    throw new Error('Failed to fetch post');
  }
  return response.json();
};

export const createPost = async (postData: PostData): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to create post' }));
    throw new Error(errorData.error || 'Failed to create post');
  }
  return response.json();
};

export const updatePost = async (id: string, postData: Partial<PostData>): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to update post' }));
    if (response.status === 404) {
      throw new Error('Post not found for update');
    }
    throw new Error(errorData.error || 'Failed to update post');
  }
  return response.json();
};

export const deletePost = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Post not found for deletion');
    }
    throw new Error('Failed to delete post');
  }
  // No content expected for 204 response
};
