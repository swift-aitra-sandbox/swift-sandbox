import { configureStore } from '@reduxjs/toolkit';
import { itemsApi } from '@mono/api';
import { uiReducer } from '@mono/ui';
import { store, AppDispatch, RootState, AppThunk } from './store';
import { AnyAction } from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { MiddlewareAPI } from 'redux';

// Mock the itemsApi to avoid actual API calls
jest.mock('@mono/api', () => ({
  itemsApi: {
    reducerPath: 'itemsApi',
    reducer: jest.fn(),
    middleware: jest.fn(),
  },
}));

// Mock the uiReducer
jest.mock('@mono/ui', () => ({
  uiReducer: jest.fn(),
}));

describe('Redux Store Configuration', () => {
  it('should configure the store with the correct reducers', () => {
    // Arrange
    const expectedReducers = {
      ui: expect.any(Function),
      itemsApi: expect.any(Function),
    };

    // Act
    const state = store.getState();

    // Assert
    expect(state).toHaveProperty('ui');
    expect(state).toHaveProperty(itemsApi.reducerPath);
    expect(store.reducer).toEqual(expectedReducers);
  });

  it('should include itemsApi.middleware in the middleware chain', () => {
    // Arrange
    const mockMiddlewareAPI: MiddlewareAPI = {
      getState: jest.fn(),
      dispatch: jest.fn(),
    };
    const next = jest.fn();

    // Act
    const middleware = store.middleware(mockMiddlewareAPI)(next);

    // Assert
    expect(middleware).toBeDefined();
    expect(itemsApi.middleware).toHaveBeenCalled();
  });
});

describe('AppDispatch Type', () => {
  it('should be of correct type', () => {
    // Arrange
    const mockDispatch: AppDispatch = store.dispatch;

    // Act
    const result = mockDispatch({ type: 'TEST_ACTION' });

    // Assert
    expect(result).toBeInstanceOf(Promise);
  });
});

describe('RootState Type', () => {
  it('should return the correct state shape', () => {
    // Act
    const state: RootState = store.getState();

    // Assert
    expect(state).toHaveProperty('ui');
    expect(state).toHaveProperty(itemsApi.reducerPath);
  });
});

describe('AppThunk Type', () => {
  it('should dispatch a thunk action correctly', async () => {
    // Arrange
    const mockDispatch: ThunkDispatch<RootState, unknown, AnyAction> = store.dispatch;
    const thunkAction: AppThunk = () => async (dispatch, getState) => {
      // Example action
      return Promise.resolve(true);
    };

    // Act
    const result = await mockDispatch(thunkAction());

    // Assert
    expect(result).toBe(true);
  });
});