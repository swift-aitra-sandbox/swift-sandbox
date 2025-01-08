import request from 'supertest';
import { Application } from 'express';
import { itemsRouter } from './items.router';
import { ItemsController } from './items.controllers';
import express from 'express';
import { StatusCodes as status } from 'http-status-codes';

jest.mock('./items.controllers');

describe('Items Router', () => {
  let app: Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api', itemsRouter);
  });

  describe('GET /items', () => {
    it('should return all items successfully', async () => {
      // Arrange
      const mockItems = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
      (ItemsController.findAllItems as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = mockItems;
        next();
      });

      // Act
      const response = await request(app).get('/api/items');

      // Assert
      expect(response.status).toBe(status.OK);
      expect(response.body).toEqual(mockItems);
    });

    it('should handle errors when retrieving all items', async () => {
      // Arrange
      (ItemsController.findAllItems as jest.Mock).mockImplementation((_req, res, next) => {
        next(new Error('Failed to fetch items'));
      });

      // Act
      const response = await request(app).get('/api/items');

      // Assert
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR);
    });
  });

  describe('GET /items/:itemId', () => {
    it('should return a single item by ID', async () => {
      // Arrange
      const mockItem = { id: 1, name: 'Item 1' };
      (ItemsController.findItemById as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = [mockItem];
        next();
      });

      // Act
      const response = await request(app).get('/api/items/1');

      // Assert
      expect(response.status).toBe(status.OK);
      expect(response.body).toEqual(mockItem);
    });

    it('should handle item not found', async () => {
      // Arrange
      (ItemsController.findItemById as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = [];
        next();
      });

      // Act
      const response = await request(app).get('/api/items/999');

      // Assert
      expect(response.status).toBe(status.NOT_FOUND);
    });
  });

  describe('POST /items', () => {
    it('should create a new item successfully', async () => {
      // Arrange
      const newItem = { name: 'New Item' };
      const createdItem = { _id: '1', name: 'New Item' };
      (ItemsController.createItem as jest.Mock).mockImplementation((_req, res, next) => {
        res.locals.items = [createdItem];
        next();
      });

      // Act
      const response = await request(app).post('/api/items').send(newItem);

      // Assert
      expect(response.status).toBe(status.CREATED);
      expect(response.header.location).toBe(`/items/${createdItem._id}`);
      expect(response.body).toEqual(createdItem);
    });

    it('should handle errors when creating an item', async () => {
      // Arrange
      (ItemsController.createItem as jest.Mock).mockImplementation((_req, res, next) => {
        next(new Error('Failed to create item'));
      });

      // Act
      const response = await request(app).post('/api/items').send({ name: 'New Item' });

      // Assert
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR);
    });
  });

  describe('DELETE /items/:itemId', () => {
    it('should delete an item successfully', async () => {
      // Arrange
      (ItemsController.deleteItem as jest.Mock).mockImplementation((_req, res, next) => {
        next();
      });

      // Act
      const response = await request(app).delete('/api/items/1');

      // Assert
      expect(response.status).toBe(status.NO_CONTENT);
      expect(response.text).toBe('Item successfully deleted');
    });

    it('should handle errors when deleting an item', async () => {
      // Arrange
      (ItemsController.deleteItem as jest.Mock).mockImplementation((_req, res, next) => {
        next(new Error('Failed to delete item'));
      });

      // Act
      const response = await request(app).delete('/api/items/999');

      // Assert
      expect(response.status).toBe(status.INTERNAL_SERVER_ERROR);
    });
  });

  // Additional tests for other endpoints can be added following the same pattern
});