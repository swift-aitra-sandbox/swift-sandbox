```typescript
import { ItemsController } from './ItemsController';
import { Request, Response, NextFunction } from 'express';
import { conn } from '../db/connection';
import { StatusCodes as status } from 'http-status-codes';
import ItemQueries from './items.queries';
import { jest } from '@jest/globals';

jest.mock('../db/connection');

describe('ItemsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  describe('findAllItems', () => {
    it('should retrieve all items and store in res.locals', async () => {
      const mockItems = [{ _id: '1' }, { _id: '2' }];
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItems });

      await ItemsController.findAllItems(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findAllItems);
      expect(res.locals.items).toEqual(mockItems);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      (conn.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ItemsController.findAllItems(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('findItemById', () => {
    it('should retrieve item by ID and store in res.locals', async () => {
      req.params = { itemId: '1' };
      const mockItem = [{ _id: '1' }];
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItem });

      await ItemsController.findItemById(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findItemById, ['1']);
      expect(res.locals.items).toEqual(mockItem);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      req.params = { itemId: '1' };
      (conn.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ItemsController.findItemById(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('findItemsByUser', () => {
    it('should retrieve items by user and store in res.locals', async () => {
      req.params = { userId: 'user1' };
      req.query = { limit: '10' };
      const mockItems = [{ _id: '1' }];
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItems });

      await ItemsController.findItemsByUser(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(
        ItemQueries.findItemsByUser,
        ['user1', '', ['-created_time', '+title'], 0, 10, {}]
      );
      expect(res.locals.items).toEqual(mockItems);
      expect(next).toHaveBeenCalled();
    });

    it('should return error if limit exceeds 100', async () => {
      req.query = { limit: '101' };

      await ItemsController.findItemsByUser(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNPROCESSABLE_ENTITY);
      expect(res.json).toHaveBeenCalledWith('Limit must be less than or equal to 100.');
    });

    it('should handle errors gracefully', async () => {
      req.params = { userId: 'user1' };
      (conn.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ItemsController.findItemsByUser(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('findItemByUser', () => {
    it('should retrieve item by user and item ID', async () => {
      req.params = { userId: 'user1', itemId: '1' };
      const mockItem = [{ _id: '1' }];
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItem });

      await ItemsController.findItemByUser(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.findItemByUser, ['user1', '1']);
      expect(res.locals.items).toEqual(mockItem);
      expect(next).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      req.params = { userId: 'user1', itemId: '1' };
      (conn.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ItemsController.findItemByUser(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('createItem', () => {
    it('should create a new item and store in res.locals', async () => {
      req.body = { title: 'Test', content: 'Content' };
      req.headers = { 'content-type': 'application/json' };
      const mockItem = [{ _id: '1' }];
      (conn.query as jest.Mock).mockResolvedValue({ rows: mockItem });

      await ItemsController.createItem(req as Request, res as Response, next);

      expect(conn.query).toHaveBeenCalledWith(ItemQueries.createItem, ['Test', 'Content']);
      expect(res.locals.items).toEqual(mockItem);
      expect(next).toHaveBeenCalled();
    });

    it('should return error if content-type is not application/json', async () => {
      req.body = { title: 'Test', content: 'Content' };
      req.headers = { 'content-type': 'text/plain' };

      await ItemsController.createItem(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(status.UNSUPPORTED_MEDIA_TYPE);
      expect(res.send).toHaveBeenCalledWith(`'Content-Type' must be 'application/json'`);
    });

    it('should handle errors gracefully', async () => {
      req.body = { title: 'Test', content: 'Content' };
      req.headers = { 'content-type': 'application/json' };
      (conn.query as jest.Mock).mockRejectedValue(new Error('Database error'));

      await ItemsController.createItem(req as Request, res as Response, next);

      expect(console.error).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('updateItem', () => {
    it('should update an item and store in res.locals', async () => {
      req.params = { itemId: '1' };
      req.body = { title: 'Updated', content