const request = require('supertest');
const app = require('./server'); // Express app
const db = require('./database'); // SQLite db instance

describe('Blog Post API', () => {
  // Clean up the posts table before each test and ensure table exists
  beforeEach((done) => {
    db.serialize(() => {
      // Ensure the table is created (idempotent)
      db.run(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return done(err);
        // Clear the table
        db.run('DELETE FROM posts', (err) => {
          if (err) return done(err);
          // Optionally, insert some mock data if needed for specific tests,
          // but for general CRUD, starting clean is often better.
          done();
        });
      });
    });
  });

  // Close the database connection after all tests are done
  afterAll((done) => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database for tests:', err.message);
        return done(err);
      }
      done();
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid data', async () => {
      const newPost = { title: 'Test Post', content: 'This is a test post.' };
      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.content).toBe(newPost.content);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 400 if title is missing', async () => {
      const newPost = { content: 'This is a test post.' };
      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(400);
      expect(response.body.error).toBe('Title and content are required');
    });

    it('should return 400 if content is missing', async () => {
      const newPost = { title: 'Test Post' };
      const response = await request(app)
        .post('/api/posts')
        .send(newPost)
        .expect(400);
      expect(response.body.error).toBe('Title and content are required');
    });
  });

  describe('GET /api/posts', () => {
    it('should return an empty array if no posts exist', async () => {
      const response = await request(app).get('/api/posts').expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
    });

    it('should return all posts', async () => {
      // First, create a post
      const post1 = { title: 'Post 1', content: 'Content 1' };
      await request(app).post('/api/posts').send(post1);

      // Introduce a more significant delay to ensure distinct createdAt timestamps
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay

      const post2 = { title: 'Post 2', content: 'Content 2' };
      await request(app).post('/api/posts').send(post2);

      const response = await request(app).get('/api/posts').expect(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(2);
      // Post2 was created later, so it should appear first when ordered by createdAt DESC
      expect(response.body[0].title).toBe(post2.title);
      expect(response.body[1].title).toBe(post1.title);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a single post if ID is valid', async () => {
      const newPost = { title: 'Fetch Me', content: 'Content to fetch.' };
      const createResponse = await request(app).post('/api/posts').send(newPost);
      const postId = createResponse.body.id;

      const response = await request(app).get(`/api/posts/${postId}`).expect(200);
      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe(newPost.title);
    });

    it('should return 404 if post ID does not exist', async () => {
      const response = await request(app).get('/api/posts/9999').expect(404);
      expect(response.body.error).toBe('Post not found');
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update an existing post with valid data', async () => {
      const newPost = { title: 'Original Title', content: 'Original Content' };
      const createResponse = await request(app).post('/api/posts').send(newPost);
      const postId = createResponse.body.id;

      const updatedData = { title: 'Updated Title', content: 'Updated Content' };
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.id).toBe(postId);
      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.content).toBe(updatedData.content);
    });

    it('should update only title if only title is provided', async () => {
      const newPost = { title: 'Original Title', content: 'Original Content' };
      const createResponse = await request(app).post('/api/posts').send(newPost);
      const postId = createResponse.body.id;

      const updatedData = { title: 'Updated Title Only' };
      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send(updatedData)
        .expect(200);
      
      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.content).toBe(newPost.content); // Content should remain unchanged
    });


    it('should return 404 if post ID does not exist for update', async () => {
      const updatedData = { title: 'Non Existent Update', content: 'Content' };
      const response = await request(app)
        .put('/api/posts/9999')
        .send(updatedData)
        .expect(404);
      expect(response.body.error).toBe('Post not found');
    });

    it('should return 400 if neither title nor content is provided for update', async () => {
      const newPost = { title: 'Test', content: 'Test Content' };
      const createResponse = await request(app).post('/api/posts').send(newPost);
      const postId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .send({})
        .expect(400);
      expect(response.body.error).toBe('Title or content must be provided for update');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete an existing post', async () => {
      const newPost = { title: 'To Be Deleted', content: 'Delete me.' };
      const createResponse = await request(app).post('/api/posts').send(newPost);
      const postId = createResponse.body.id;

      await request(app).delete(`/api/posts/${postId}`).expect(204);

      // Verify it's gone
      await request(app).get(`/api/posts/${postId}`).expect(404);
    });

    it('should return 404 if post ID does not exist for deletion', async () => {
      const response = await request(app).delete('/api/posts/9999').expect(404);
      expect(response.body.error).toBe('Post not found');
    });
  });
});
