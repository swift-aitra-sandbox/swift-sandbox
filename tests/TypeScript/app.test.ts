import { MyModule } from './MyModule';
import { MyDependency } from './MyDependency';
import { jest } from '@jest/globals';

describe('MyModule Tests', () => {
  let myModule: MyModule;
  let mockDependency: jest.Mocked<MyDependency>;

  beforeEach(() => {
    mockDependency = {
      fetchData: jest.fn(),
      saveData: jest.fn(),
    };
    myModule = new MyModule(mockDependency);
  });

  describe('fetchData', () => {
    it('should fetch data successfully', async () => {
      // Arrange
      const expectedData = { id: 1, value: 'test' };
      mockDependency.fetchData.mockResolvedValue(expectedData);

      // Act
      const result = await myModule.fetchData();

      // Assert
      expect(result).toEqual(expectedData);
      expect(mockDependency.fetchData).toHaveBeenCalled();
    });

    it('should handle fetch data error', async () => {
      // Arrange
      const errorMessage = 'Fetch error';
      mockDependency.fetchData.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(myModule.fetchData()).rejects.toThrow(errorMessage);
    });
  });

  describe('saveData', () => {
    it('should save data successfully', async () => {
      // Arrange
      const dataToSave = { id: 1, value: 'test' };
      mockDependency.saveData.mockResolvedValue(true);

      // Act
      const result = await myModule.saveData(dataToSave);

      // Assert
      expect(result).toBe(true);
      expect(mockDependency.saveData).toHaveBeenCalledWith(dataToSave);
    });

    it('should handle save data error', async () => {
      // Arrange
      const dataToSave = { id: 1, value: 'test' };
      const errorMessage = 'Save error';
      mockDependency.saveData.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(myModule.saveData(dataToSave)).rejects.toThrow(errorMessage);
    });

    it('should not save invalid data', async () => {
      // Arrange
      const invalidData = null;

      // Act & Assert
      await expect(myModule.saveData(invalidData)).rejects.toThrow('Invalid data');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data fetch', async () => {
      // Arrange
      mockDependency.fetchData.mockResolvedValue(null);

      // Act
      const result = await myModule.fetchData();

      // Assert
      expect(result).toBeNull();
      expect(mockDependency.fetchData).toHaveBeenCalled();
    });

    it('should handle large data save', async () => {
      // Arrange
      const largeData = { id: 1, value: 'x'.repeat(10000) };
      mockDependency.saveData.mockResolvedValue(true);

      // Act
      const result = await myModule.saveData(largeData);

      // Assert
      expect(result).toBe(true);
      expect(mockDependency.saveData).toHaveBeenCalledWith(largeData);
    });
  });
});