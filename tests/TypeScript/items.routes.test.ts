import request from 'supertest';
import express, { Express } from 'express';
import { itemsRouter } from './items.router';
import { ItemsController } from './items.controllers';
import { StatusCodes as status } from 'http-status-codes';

// Mock the ItemsController methods
jest.mock('./items.controllers');

describe('Items Router', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', itemsRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    it('should return all items with status 200', async () => {
      const mockItems = [{ id: '1', name: 'Item 1' }, { id: '2', name: 'Item 2' }];
      (ItemsController.findAllItems as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = mockItems;
        next();
      });

      const response = await request(app).get('/api/items');
      expect(response.status).toBe(status.OK);
      expect(response.body).toEqual(mockItems);
    });

    it('should handle errors in findAllItems', async () => {
      (ItemsController.findAllItems as jest.Mock).mockImplementation((_req, res, next) => {
        next(new Error('Database error'));
      });

      const response = await request(app).get('/api/items');
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /api/items/:itemId', () => {
    it('should return item by id with status 200', async () => {
      const mockItem = { id: '1', name: 'Item 1' };
      (ItemsController.findItemById as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = [mockItem];
        next();
      });

      const response = await request(app).get('/api/items/1');
      expect(response.status).toBe(status.OK);
      expect(response.body).toEqual(mockItem);
    });

    it('should return 404 for non-existent item', async () => {
      (ItemsController.findItemById as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = [];
        next();
      });

      const response = await request(app).get('/api/items/999');
      expect(response.status).toBe(status.NOT_FOUND);
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item and return it with status 201', async () => {
      const mockItem = { _id: '1', name: 'New Item' };
      (ItemsController.createItem as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = [mockItem];
        next();
      });

      const response = await request(app).post('/api/items').send({ name: 'New Item' });
      expect(response.status).toBe(status.CREATED);
      expect(response.body).toEqual(mockItem);
      expect(response.header['location']).toBe(`/items/${mockItem._id}`);
    });

    it('should handle errors in createItem', async () => {
      (ItemsController.createItem as jest.Mock).mockImplementation((_req, res, next) => {
        next(new Error('Validation error'));
      });

      const response = await request(app).post('/api/items').send({ name: '' });
      expect(response.status).toBe(status.BAD_REQUEST);
    });
  });

  describe('DELETE /api/items/:itemId', () => {
    it('should delete an item and return status 204', async () => {
      (ItemsController.deleteItem as jest.Mock).mockImplementation((_req, res, next) => {
        next();
      });

      const response = await request(app).delete('/api/items/1');
      expect(response.status).toBe(status.NO_CONTENT);
    });

    it('should return 404 for non-existent item', async () => {
      (ItemsController.deleteItem as jest.Mock).mockImplementation((_req, res, next) => {
        next(new Error('Item not found'));
      });

      const response = await request(app).delete('/api/items/999');
      expect(response.status).toBe(status.NOT_FOUND);
    });
  });

  // Further tests for other routes and methods would follow a similar pattern
});