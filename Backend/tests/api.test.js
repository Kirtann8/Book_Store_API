const request = require('supertest');
const app = require('../app');

describe('Book Store API', () => {
  let userToken;
  let bookId;

  // Health Check
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  // Authentication Tests
  describe('Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'user'
        });
      expect(res.statusCode).toBe(201);
    });

    it('should login user', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      userToken = res.body.token;
    });
  });

  // Books Tests
  describe('Books', () => {
    it('should get all books', async () => {
      const res = await request(app).get('/api/v1/books');
      expect(res.statusCode).toBe(200);
    });

    it('should search books', async () => {
      const res = await request(app).get('/api/v1/books/search?q=test');
      expect(res.statusCode).toBe(200);
    });
  });

  // Cart Tests
  describe('Cart', () => {
    it('should get user cart', async () => {
      const res = await request(app)
        .get('/api/v1/cart')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
    });
  });

  // Profile Tests
  describe('Profile', () => {
    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toBe(200);
    });
  });
});