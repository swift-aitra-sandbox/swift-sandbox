import request from 'supertest';
import express, { Application } from 'express';
import { App } from './path-to-your-app-file'; // Adjust the import path accordingly
import { itemsRouter } from './items/items.routes';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import slowDown from 'express-slow-down';
import morgan from 'morgan';
import nocache from 'nocache';
import useragent from 'express-useragent';

jest.mock('./db/connection', () => jest.fn());
jest.mock('./items/items.routes', () => ({
  itemsRouter: jest.fn().mockReturnValue(express.Router())
}));

describe('App', () => {
  let app: Application;

  beforeAll(async () => {
    app = await new App().main();
  });

  describe('Configuration', () => {
    it('should disable x-powered-by header', () => {
      const expressApp = express();
      expressApp.disable = jest.fn();
      new App();
      expect(expressApp.disable).toHaveBeenCalledWith('x-powered-by');
    });

    it('should set etag to false', () => {
      const expressApp = express();
      expressApp.set = jest.fn();
      new App();
      expect(expressApp.set).toHaveBeenCalledWith('etag', false);
    });
  });

  describe('Middleware', () => {
    it('should use useragent middleware', () => {
      expect(useragent.express).toHaveBeenCalled();
    });

    it('should use nocache middleware', () => {
      expect(nocache).toHaveBeenCalled();
    });

    it('should use helmet middleware', () => {
      expect(helmet).toHaveBeenCalledWith(expect.objectContaining({
        contentSecurityPolicy: expect.any(Boolean)
      }));
    });

    it('should use hpp middleware', () => {
      expect(hpp).toHaveBeenCalledWith(expect.objectContaining({
        checkBody: true,
        checkQuery: true
      }));
    });

    it('should use compression middleware', () => {
      expect(compression).toHaveBeenCalledWith(expect.objectContaining({
        strategy: expect.any(Number),
        level: expect.any(Number),
        memLevel: expect.any(Number)
      }));
    });

    it('should use cors middleware', () => {
      expect(cors).toHaveBeenCalledWith(expect.objectContaining({
        origin: '*',
        methods: expect.arrayContaining(['GET', 'POST', 'PUT', 'DELETE']),
        allowedHeaders: expect.arrayContaining(['Content-Type', 'Authorization', 'Accept']),
        credentials: true
      }));
    });

    it('should use rateLimit middleware', () => {
      expect(rateLimit).toHaveBeenCalledWith(expect.objectContaining({
        windowMs: expect.any(Number),
        max: expect.any(Number),
        message: expect.any(String)
      }));
    });

    it('should use slowDown middleware', () => {
      expect(slowDown).toHaveBeenCalledWith(expect.objectContaining({
        windowMs: expect.any(Number),
        delayMs: expect.any(Number),
        delayAfter: expect.any(Number)
      }));
    });

    it('should use morgan middleware in non-production/test env', () => {
      process.env.NODE_ENV = 'development';
      const expressApp = express();
      expressApp.use = jest.fn();
      new App();
      expect(morgan).toHaveBeenCalledWith('dev');
    });
  });

  describe('Routes', () => {
    it('should use itemsRouter for /api/v1/', () => {
      expect(itemsRouter).toHaveBeenCalled();
    });

    it('should respond with API service online for root and api routes', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('API service online');
    });

    it('should respond with 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
      expect(response.text).toBe('Cannot find requested resource');
    });
  });

  describe('Global Error Handling', () => {
    it('should handle errors and respond with a default error message', async () => {
      const errorMiddleware = app._router.stack.find(layer => layer.handle.length === 2).handle;
      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const error = new Error('Test error');
      errorMiddleware(error, mockResponse);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});