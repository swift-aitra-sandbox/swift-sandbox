import { renderHook } from '@testing-library/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from './yourModule';
import type { AppDispatch, RootState } from './yourModule';

// Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe('Custom Redux Hooks', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAppDispatch', () => {
    it('should return the dispatch function', () => {
      // Arrange
      const mockDispatch = jest.fn();
      (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
      
      // Act
      const { result } = renderHook(() => useAppDispatch());

      // Assert
      expect(result.current).toBe(mockDispatch);
      expect(useDispatch).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if useDispatch is not mocked', () => {
      // Arrange
      (useDispatch as jest.Mock).mockImplementation(() => {
        throw new Error('useDispatch not mocked');
      });

      // Act & Assert
      expect(() => renderHook(() => useAppDispatch())).toThrow('useDispatch not mocked');
    });
  });

  describe('useAppSelector', () => {
    it('should return the selector result', () => {
      // Arrange
      const mockState: RootState = { /* mock state here */ };
      const mockSelectorResult = { data: 'test' };
      (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
      
      // Act
      const { result } = renderHook(() => useAppSelector((state) => state.data));

      // Assert
      expect(result.current).toEqual(mockSelectorResult);
      expect(useSelector).toHaveBeenCalledTimes(1);
    });

    it('should handle selector returning undefined', () => {
      // Arrange
      const mockState: RootState = { /* mock state here */ };
      (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));
      
      // Act
      const { result } = renderHook(() => useAppSelector((state) => state.nonExistentProperty));

      // Assert
      expect(result.current).toBeUndefined();
      expect(useSelector).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if useSelector is not mocked', () => {
      // Arrange
      (useSelector as jest.Mock).mockImplementation(() => {
        throw new Error('useSelector not mocked');
      });

      // Act & Assert
      expect(() => renderHook(() => useAppSelector((state) => state.data))).toThrow('useSelector not mocked');
    });
  });

});