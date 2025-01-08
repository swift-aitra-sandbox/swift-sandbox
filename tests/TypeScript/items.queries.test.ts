import { expect } from 'chai';
import sinon from 'sinon';
import database from './database'; // Assuming a database module for executing SQL queries
import queries from './queries'; // The module containing the SQL queries

describe('SQL Queries', () => {

  let dbStub: sinon.SinonStub;

  beforeEach(() => {
    dbStub = sinon.stub(database, 'execute');
  });

  afterEach(() => {
    dbStub.restore();
  });

  describe('findAllItems', () => {
    it('should retrieve all items from the database', async () => {
      // Arrange
      const mockItems = [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }];
      dbStub.resolves(mockItems);

      // Act
      const result = await database.execute(queries.findAllItems);

      // Assert
      expect(result).to.deep.equal(mockItems);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.findAllItems);
    });
  });

  describe('findItemById', () => {
    it('should retrieve an item by ID', async () => {
      // Arrange
      const mockItem = { id: 1, title: 'Item 1' };
      dbStub.resolves([mockItem]);

      // Act
      const result = await database.execute(queries.findItemById, [1]);

      // Assert
      expect(result).to.deep.equal([mockItem]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.findItemById, [1]);
    });

    it('should return an empty array if item not found', async () => {
      // Arrange
      dbStub.resolves([]);

      // Act
      const result = await database.execute(queries.findItemById, [999]);

      // Assert
      expect(result).to.deep.equal([]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.findItemById, [999]);
    });
  });

  describe('findItemsByUser', () => {
    it('should retrieve items by user with matching title or content', async () => {
      // Arrange
      const mockItems = [{ id: 1, title: 'Item 1' }];
      dbStub.resolves(mockItems);

      // Act
      const result = await database.execute(queries.findItemsByUser, [1, '%Item%', 'title', 0, 10]);

      // Assert
      expect(result).to.deep.equal(mockItems);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.findItemsByUser, [1, '%Item%', 'title', 0, 10]);
    });

    it('should handle no matching items', async () => {
      // Arrange
      dbStub.resolves([]);

      // Act
      const result = await database.execute(queries.findItemsByUser, [1, '%Nonexistent%', 'title', 0, 10]);

      // Assert
      expect(result).to.deep.equal([]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.findItemsByUser, [1, '%Nonexistent%', 'title', 0, 10]);
    });
  });

  describe('createItem', () => {
    it('should create an item and return the new item', async () => {
      // Arrange
      const newItem = { id: 1, title: 'New Item', content: 'New Content' };
      dbStub.resolves([newItem]);

      // Act
      const result = await database.execute(queries.createItem, ['New Item', 'New Content']);

      // Assert
      expect(result).to.deep.equal([newItem]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.createItem, ['New Item', 'New Content']);
    });
  });

  describe('updateItem', () => {
    it('should update an existing item', async () => {
      // Arrange
      const updatedItem = { id: 1, title: 'Updated Item', content: 'Updated Content' };
      dbStub.resolves([updatedItem]);

      // Act
      const result = await database.execute(queries.updateItem, ['Updated Item', 'Updated Content', 1]);

      // Assert
      expect(result).to.deep.equal([updatedItem]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.updateItem, ['Updated Item', 'Updated Content', 1]);
    });

    it('should return an empty array if item to update does not exist', async () => {
      // Arrange
      dbStub.resolves([]);

      // Act
      const result = await database.execute(queries.updateItem, ['Nonexistent Item', 'Content', 999]);

      // Assert
      expect(result).to.deep.equal([]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.updateItem, ['Nonexistent Item', 'Content', 999]);
    });
  });

  describe('deleteItem', () => {
    it('should delete an item and return the deleted item', async () => {
      // Arrange
      const deletedItem = { id: 1, title: 'Deleted Item' };
      dbStub.resolves([deletedItem]);

      // Act
      const result = await database.execute(queries.deleteItem, [1]);

      // Assert
      expect(result).to.deep.equal([deletedItem]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.deleteItem, [1]);
    });

    it('should return an empty array if item to delete does not exist', async () => {
      // Arrange
      dbStub.resolves([]);

      // Act
      const result = await database.execute(queries.deleteItem, [999]);

      // Assert
      expect(result).to.deep.equal([]);
      sinon.assert.calledOnce(dbStub);
      sinon.assert.calledWith(dbStub, queries.deleteItem, [999]);
    });
  });

});