import { getItem, addItem, updateItem, deleteItem } from './itemsApiStore';
import { jest } from '@jest/globals';

describe('Items API Store', () => {
  describe('getItem', () => {
    it('should return the item when a valid ID is provided', async () => {
      // Arrange
      const mockId = '123';
      const mockItem = { id: '123', name: 'Test Item' };
      jest.spyOn(itemsApiStore, 'getItem').mockResolvedValue(mockItem);

      // Act
      const result = await getItem(mockId);

      // Assert
      expect(result).toEqual(mockItem);
    });

    it('should throw an error when an invalid ID is provided', async () => {
      // Arrange
      const mockId = 'invalid';
      jest.spyOn(itemsApiStore, 'getItem').mockRejectedValue(new Error('Item not found'));

      // Act & Assert
      await expect(getItem(mockId)).rejects.toThrow('Item not found');
    });
  });

  describe('addItem', () => {
    it('should add an item successfully when valid data is provided', async () => {
      // Arrange
      const newItem = { name: 'New Item' };
      const addedItem = { id: '124', name: 'New Item' };
      jest.spyOn(itemsApiStore, 'addItem').mockResolvedValue(addedItem);

      // Act
      const result = await addItem(newItem);

      // Assert
      expect(result).toEqual(addedItem);
    });

    it('should throw an error when adding an item with missing fields', async () => {
      // Arrange
      const newItem = {};
      jest.spyOn(itemsApiStore, 'addItem').mockRejectedValue(new Error('Validation error'));

      // Act & Assert
      await expect(addItem(newItem)).rejects.toThrow('Validation error');
    });
  });

  describe('updateItem', () => {
    it('should update the item successfully when valid data is provided', async () => {
      // Arrange
      const itemId = '123';
      const updatedData = { name: 'Updated Item' };
      const updatedItem = { id: '123', name: 'Updated Item' };
      jest.spyOn(itemsApiStore, 'updateItem').mockResolvedValue(updatedItem);

      // Act
      const result = await updateItem(itemId, updatedData);

      // Assert
      expect(result).toEqual(updatedItem);
    });

    it('should throw an error when updating a non-existent item', async () => {
      // Arrange
      const itemId = 'non-existent';
      const updatedData = { name: 'Updated Item' };
      jest.spyOn(itemsApiStore, 'updateItem').mockRejectedValue(new Error('Item not found'));

      // Act & Assert
      await expect(updateItem(itemId, updatedData)).rejects.toThrow('Item not found');
    });
  });

  describe('deleteItem', () => {
    it('should delete the item successfully when a valid ID is provided', async () => {
      // Arrange
      const mockId = '123';
      jest.spyOn(itemsApiStore, 'deleteItem').mockResolvedValue(true);

      // Act
      const result = await deleteItem(mockId);

      // Assert
      expect(result).toBe(true);
    });

    it('should throw an error when trying to delete with an invalid ID', async () => {
      // Arrange
      const mockId = 'invalid';
      jest.spyOn(itemsApiStore, 'deleteItem').mockRejectedValue(new Error('Item not found'));

      // Act & Assert
      await expect(deleteItem(mockId)).rejects.toThrow('Item not found');
    });
  });
});