const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints

// POST /api/posts - Create a new post
app.post('/api/posts', (req, res) => {
  const { title, content, imageUrl } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const query = 'INSERT INTO posts (title, content, imageUrl) VALUES (?, ?, ?)';
  db.run(query, [title, content, imageUrl || null], function (err) {
    if (err) {
      console.error('Error inserting post:', err.message);
      return res.status(500).json({ error: 'Failed to create post' });
    }
    // Get the newly created post
    db.get('SELECT * FROM posts WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        console.error('Error fetching created post:', err.message);
        return res.status(500).json({ error: 'Failed to retrieve created post' });
      }
      res.status(201).json(row);
    });
  });
});

// GET /api/posts - Get all posts
app.get('/api/posts', (req, res) => {
  const query = 'SELECT * FROM posts ORDER BY createdAt DESC, id DESC';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching posts:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve posts' });
    }
    res.status(200).json(rows);
  });
});

// GET /api/posts/:id - Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM posts WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching post by ID:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve post' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(row);
  });
});

// PUT /api/posts/:id - Update a post by ID
app.put('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl } = req.body;

  if (!title && !content && imageUrl === undefined) {
    return res.status(400).json({ error: 'Title, content, or imageUrl must be provided for update' });
  }

  let fieldsToUpdate = [];
  let queryParams = [];

  if (title) {
    fieldsToUpdate.push('title = ?');
    queryParams.push(title);
  }
  if (content) {
    fieldsToUpdate.push('content = ?');
    queryParams.push(content);
  }
  if (imageUrl !== undefined) { // Allows setting imageUrl to null or a new string
    fieldsToUpdate.push('imageUrl = ?');
    queryParams.push(imageUrl);
  }
  queryParams.push(id);

  const query = `UPDATE posts SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;

  db.run(query, queryParams, function (err) {
    if (err) {
      console.error('Error updating post:', err.message);
      return res.status(500).json({ error: 'Failed to update post' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    // Get the updated post
    db.get('SELECT * FROM posts WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching updated post:', err.message);
        return res.status(500).json({ error: 'Failed to retrieve updated post' });
      }
      res.status(200).json(row);
    });
  });
});

// DELETE /api/posts/:id - Delete a post by ID
app.delete('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM posts WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Error deleting post:', err.message);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).send(); // No Content
  });
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // For potential testing
