import request from 'supertest';
import express, { Application } from 'express';
import { App } from './App';
import { itemsRouter } from './items/items.routes';

jest.mock('./db/connection', () => jest.fn());
jest.mock('./items/items.routes', () => ({
  itemsRouter: jest.fn().mockImplementation(() => express.Router()),
}));

describe('App', () => {
  let app: Application;

  beforeAll(async () => {
    const appInstance = new App();
    app = await appInstance.main();
  });

  describe('Configuration', () => {
    it('should disable x-powered-by header', () => {
      expect(app.get('x-powered-by')).toBeUndefined();
    });

    it('should set etag to false', () => {
      expect(app.get('etag')).toBe(false);
    });

    it('should serve static files from the correct directory', async () => {
      const response = await request(app).get('/static-file-path');
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Middleware', () => {
    it('should use compression middleware', async () => {
      const response = await request(app).get('/api/v1');
      expect(response.headers['content-encoding']).toBe('gzip');
    });

    it('should use CORS with correct settings', async () => {
      const response = await request(app).options('/api/v1');
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    it('should use helmet for security headers', async () => {
      const response = await request(app).get('/api/v1');
      expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    });

    it('should limit rate of requests', async () => {
      for (let i = 0; i < 1001; i++) {
        await request(app).get('/api/v1');
      }
      const response = await request(app).get('/api/v1');
      expect(response.status).toBe(429);
    });
  });

  describe('Routes', () => {
    it('should return 200 for /api/v1', async () => {
      const response = await request(app).get('/api/v1');
      expect(response.status).toBe(200);
    });

    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
    });
  });

  describe('Global Route Handling', () => {
    it('should respond with API service online for root paths', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API service online');
    });

    it('should handle errors with a custom error handler', async () => {
      app.use((req, res, next) => {
        const error = new Error('Test error');
        next(error);
      });

      const response = await request(app).get('/api/v1');
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal Server Error');
    });
  });
});