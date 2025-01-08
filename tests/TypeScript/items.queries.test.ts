import { expect } from 'chai';
import sinon from 'sinon';
import sqlQueries from './path-to-your-sql-file'; // Adjust the path accordingly

describe('SQL Query Tests', () => {
  
  describe('findAllItems', () => {
    it('should return a query to select all items', () => {
      // Arrange
      const expectedQuery = 'SELECT * FROM items;';

      // Act
      const query = sqlQueries.findAllItems;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should select all items');
    });
  });

  describe('findItemById', () => {
    it('should return a query to select an item by ID', () => {
      // Arrange
      const expectedQuery = 'SELECT * FROM items WHERE _id = $1;';

      // Act
      const query = sqlQueries.findItemById;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should select item by ID');
    });
  });

  describe('findItemsByUser', () => {
    it('should return a query to select items by user with filters', () => {
      // Arrange
      const expectedQuery = `
        SELECT * FROM items
        LEFT JOIN users.name AS username, users.email AS email
        ON items.user_id = users._id
        WHERE user_id = $1 AND title LIKE $2 OR content LIKE $2
        ORDER BY $3
        OFFSET $4
        LIMIT $5;
      `.trim();

      // Act
      const query = sqlQueries.findItemsByUser;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should select items by user with filters');
    });
  });

  describe('findItemByUser', () => {
    it('should return a query to select an item by user ID and item ID', () => {
      // Arrange
      const expectedQuery = `
        SELECT * FROM items
        LEFT JOIN users
        ON items.user_id = users._id
        WHERE users._id = $1 AND items._id = $2;
      `.trim();

      // Act
      const query = sqlQueries.findItemByUser;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should select item by user ID and item ID');
    });
  });

  describe('createItem', () => {
    it('should return a query to insert a new item', () => {
      // Arrange
      const expectedQuery = `
        INSERT INTO items (title, content)
        VALUES ($1, $2)
        RETURNING *;
      `.trim();

      // Act
      const query = sqlQueries.createItem;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should insert a new item');
    });
  });

  describe('updateItem', () => {
    it('should return a query to update an item', () => {
      // Arrange
      const expectedQuery = `
        UPDATE items
        SET title = $1, content = $2, modified_time = CURRENT_TIMESTAMP
        WHERE _id = $3
        RETURNING *;
      `.trim();

      // Act
      const query = sqlQueries.updateItem;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should update an item');
    });
  });

  describe('deleteItem', () => {
    it('should return a query to delete an item', () => {
      // Arrange
      const expectedQuery = `
        DELETE FROM items
        WHERE _id = $1
        RETURNING *;
      `.trim();

      // Act
      const query = sqlQueries.deleteItem;

      // Assert
      expect(query.trim()).to.equal(expectedQuery, 'Query should delete an item');
    });
  });
});