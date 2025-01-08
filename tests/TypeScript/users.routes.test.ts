import request from 'supertest';
import express from 'express';
import { usersRouter } from './path-to-your-router-file';

const app = express();
app.use(express.json());
app.use('/api/users', usersRouter);

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return an empty array when no users exist', async () => {
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body.users).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      // Mock the internal logic to throw an error
      jest.spyOn(usersRouter, 'get').mockImplementationOnce((req, res) => {
        throw new Error('Test error');
      });

      const response = await request(app).get('/api/users');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch users');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user when a valid ID is provided', async () => {
      const validId = '123';
      const response = await request(app).get(`/api/users/${validId}`);
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({ id: validId });
    });

    it('should handle errors gracefully', async () => {
      // Mock the internal logic to throw an error
      jest.spyOn(usersRouter, 'get').mockImplementationOnce((req, res) => {
        throw new Error('Test error');
      });

      const response = await request(app).get('/api/users/invalid-id');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to fetch user');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user and return it', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };
      const response = await request(app).post('/api/users').send(newUser);
      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(newUser);
    });

    it('should handle errors gracefully', async () => {
      // Mock the internal logic to throw an error
      jest.spyOn(usersRouter, 'post').mockImplementationOnce((req, res) => {
        throw new Error('Test error');
      });

      const response = await request(app).post('/api/users').send({});
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to create user');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user and return the updated user', async () => {
      const userId = '123';
      const updates = { name: 'Jane Doe' };
      const response = await request(app).put(`/api/users/${userId}`).send(updates);
      expect(response.status).toBe(200);
      expect(response.body.user).toEqual({ id: userId, ...updates });
    });

    it('should handle errors gracefully', async () => {
      // Mock the internal logic to throw an error
      jest.spyOn(usersRouter, 'put').mockImplementationOnce((req, res) => {
        throw new Error('Test error');
      });

      const response = await request(app).put('/api/users/invalid-id').send({});
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to update user');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user and return a success message', async () => {
      const userId = '123';
      const response = await request(app).delete(`/api/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(`User ${userId} deleted successfully`);
    });

    it('should handle errors gracefully', async () => {
      // Mock the internal logic to throw an error
      jest.spyOn(usersRouter, 'delete').mockImplementationOnce((req, res) => {
        throw new Error('Test error');
      });

      const response = await request(app).delete('/api/users/invalid-id');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to delete user');
    });
  });
});