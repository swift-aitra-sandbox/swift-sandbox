import { renderHook } from '@testing-library/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch, useAppSelector } from './yourModule'; // Adjust the import path as needed
import type { AppDispatch, RootState } from './yourModule'; // Adjust the import path as needed
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

// Mock store setup
const mockStore = configureStore<RootState, AppDispatch>([]);
const initialState: RootState = {
  // Define your initial state here
};

describe('useAppDispatch Hook', () => {
  it('should return the dispatch function from Redux', () => {
    // Arrange
    const store = mockStore(initialState);

    // Act
    const { result } = renderHook(() => useAppDispatch(), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    // Assert
    expect(result.current).toBe(store.dispatch);
  });
});

describe('useAppSelector Hook', () => {
  it('should return the correct state from the Redux store', () => {
    // Arrange
    const store = mockStore(initialState);

    // Act
    const { result } = renderHook(() => useAppSelector((state) => state), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    // Assert
    expect(result.current).toBe(initialState);
  });

  it('should return the correct part of the state when a selector is used', () => {
    // Arrange
    const customState = { ...initialState, someKey: 'someValue' };
    const store = mockStore(customState);

    // Act
    const { result } = renderHook(() => useAppSelector((state) => state.someKey), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    // Assert
    expect(result.current).toBe('someValue');
  });

  it('should handle an empty state gracefully', () => {
    // Arrange
    const store = mockStore({} as RootState);

    // Act
    const { result } = renderHook(() => useAppSelector((state) => state), {
      wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
    });

    // Assert
    expect(result.current).toEqual({});
  });
});