import { configureStore } from '@reduxjs/toolkit';
import { itemsApi } from '@mono/api';
import { uiReducer } from '@mono/ui';
import { store, AppDispatch, RootState } from './store'; // Adjust the path as necessary
import { AnyAction } from 'redux';

// Mocking itemsApi for testing purposes
jest.mock('@mono/api', () => ({
  itemsApi: {
    reducerPath: 'itemsApi',
    reducer: jest.fn(),
    middleware: jest.fn()
  }
}));

describe('Redux Store Configuration', () => {
  let testStore: typeof store;
  
  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        ui: uiReducer,
        [itemsApi.reducerPath]: itemsApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(itemsApi.middleware),
    });
  });

  test('should configure store with correct reducers', () => {
    // Arrange
    const expectedReducers = ['ui', 'itemsApi'];

    // Act
    const actualReducers = Object.keys(testStore.getState());

    // Assert
    expect(actualReducers).toEqual(expectedReducers);
  });

  test('should include itemsApi middleware', () => {
    // Arrange
    const middleware = testStore.middleware;

    // Act
    const hasItemsApiMiddleware = middleware.some(mw => mw === itemsApi.middleware);

    // Assert
    expect(hasItemsApiMiddleware).toBe(true);
  });

  test('should have a valid AppDispatch type', () => {
    // Act
    const dispatch: AppDispatch = testStore.dispatch;

    // Assert
    expect(dispatch).toBeInstanceOf(Function);
  });

  test('should have a valid RootState type', () => {
    // Act
    const state: RootState = testStore.getState();

    // Assert
    expect(state).toBeInstanceOf(Object);
  });

  test('should handle unknown actions gracefully', () => {
    // Arrange
    const unknownAction: AnyAction = { type: 'UNKNOWN_ACTION' };

    // Act
    const stateBefore = testStore.getState();
    testStore.dispatch(unknownAction);
    const stateAfter = testStore.getState();

    // Assert
    expect(stateAfter).toEqual(stateBefore);
  });

  // Additional tests for edge cases and error handling
  test('should handle empty initial state', () => {
    // Arrange
    const initialState = testStore.getState();

    // Assert
    expect(initialState).toBeDefined();
    expect(initialState.ui).toBeDefined();
    expect(initialState.itemsApi).toBeDefined();
  });

  test('should throw error if reducer is not a function', () => {
    expect(() => {
      configureStore({
        reducer: {
          ui: null as any // Intentional error for testing
        }
      });
    }).toThrow('Reducer must be a function');
  });
});