```typescript
import { ItemsController } from './ItemsController';
import { Request, Response, NextFunction } from 'express';
import { conn } from '../db/connection';
import ItemQueries from './items.queries';
import { StatusCodes as status } from 'http-status-codes';
import { jest } from '@jest/globals';

jest.mock('../db/connection');

describe('ItemsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
      headers: {},
    };
    res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllItems', () => {
    it('should retrieve all items and call next', async () => {
      const mockItems = [{ _id: '1' }, { _id: '2' }];
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItems });

      await ItemsController.findAllItems(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findAllItems);
      expect(res.locals.items).toEqual(mockItems);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      (conn.query as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await ItemsController.findAllItems(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findItemById', () => {
    it('should retrieve item by ID and call next', async () => {
      const mockItem = [{ _id: '1' }];
      req.params = { itemId: '1' };
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItem });

      await ItemsController.findItemById(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findItemById, ['1']);
      expect(res.locals.items).toEqual(mockItem);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      req.params = { itemId: '1' };
      (conn.query as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await ItemsController.findItemById(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findItemsByUser', () => {
    it('should retrieve items by user and call next', async () => {
      const mockItems = [{ _id: '1' }];
      req.params = { userId: 'user1' };
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItems });

      await ItemsController.findItemsByUser(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findItemsByUser, [
        'user1', '', ['-created_time', '+title'], 0, 100, {},
      ]);
      expect(res.locals.items).toEqual(mockItems);
      expect(next).toHaveBeenCalled();
    });

    it('should return 422 if limit exceeds 100', async () => {
      req.query = { limit: '101' };

      await ItemsController.findItemsByUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNPROCESSABLE_ENTITY);
      expect(res.json).toHaveBeenCalledWith('Limit must be less than or equal to 100.');
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      req.params = { userId: 'user1' };
      (conn.query as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await ItemsController.findItemsByUser(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('findItemByUser', () => {
    it('should retrieve item by user and item ID and call next', async () => {
      const mockItem = [{ _id: '1' }];
      req.params = { userId: 'user1', itemId: '1' };
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItem });

      await ItemsController.findItemByUser(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findItemByUser, ['user1', '1']);
      expect(res.locals.items).toEqual(mockItem);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      req.params = { userId: 'user1', itemId: '1' };
      (conn.query as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await ItemsController.findItemByUser(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('createItem', () => {
    it('should create a new item and call next', async () => {
      const mockItem = [{ _id: '1' }];
      req.body = { title: 'New Item', content: 'Item content' };
      req.headers = { 'content-type': 'application/json' };
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItem });

      await ItemsController.createItem(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.createItem, ['New Item', 'Item content']);
      expect(res.locals.items).toEqual(mockItem);
      expect(next).toHaveBeenCalled();
    });

    it('should return 415 if content-type is not application/json', async () => {
      req.body = { title: 'New Item', content: 'Item content' };
      req.headers = { 'content-type': 'text/plain' };

      await ItemsController.createItem(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNSUPPORTED_MEDIA_TYPE);
      expect(res.send).toHaveBeenCalledWith(`'Content-Type' must be 'application/json'`);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      req.body = { title: 'New Item', content: 'Item content' };
      req.headers = { 'content-type': 'application/json' };
      (conn.query as jest.Mock).mockRejectedValue(error);
      console.error = jest.fn();

      await ItemsController.createItem(req as Request,