import { configureStore } from '@reduxjs/toolkit';
import { uiReducer, setActiveItemId, toggleEditorModal, toggleOpenAll } from './uiSlice';
import type { UIState } from './';

// Mock UUID for testing purposes
const mockUUID: string = '123e4567-e89b-12d3-a456-426614174000';

describe('uiSlice Reducers', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ui: uiReducer,
      },
    });
  });

  describe('setActiveItemId', () => {
    it('should set activeItemId when a valid UUID is provided', () => {
      // Arrange
      const expectedState: UIState = {
        activeItemId: mockUUID,
        showEditorModal: false,
        openAll: false,
      };

      // Act
      store.dispatch(setActiveItemId(mockUUID));

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });

    it('should set activeItemId to null when null is provided', () => {
      // Arrange
      const expectedState: UIState = {
        activeItemId: null,
        showEditorModal: false,
        openAll: false,
      };

      // Act
      store.dispatch(setActiveItemId(null));

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });

    it('should set activeItemId to undefined when undefined is provided', () => {
      // Arrange
      const expectedState: UIState = {
        activeItemId: undefined,
        showEditorModal: false,
        openAll: false,
      };

      // Act
      store.dispatch(setActiveItemId(undefined));

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });
  });

  describe('toggleEditorModal', () => {
    it('should toggle showEditorModal from false to true', () => {
      // Arrange
      const expectedState: UIState = {
        activeItemId: undefined,
        showEditorModal: true,
        openAll: false,
      };

      // Act
      store.dispatch(toggleEditorModal());

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });

    it('should toggle showEditorModal from true to false', () => {
      // Arrange
      store.dispatch(toggleEditorModal()); // set to true first
      const expectedState: UIState = {
        activeItemId: undefined,
        showEditorModal: false,
        openAll: false,
      };

      // Act
      store.dispatch(toggleEditorModal());

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });
  });

  describe('toggleOpenAll', () => {
    it('should toggle openAll from false to true', () => {
      // Arrange
      const expectedState: UIState = {
        activeItemId: undefined,
        showEditorModal: false,
        openAll: true,
      };

      // Act
      store.dispatch(toggleOpenAll());

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });

    it('should toggle openAll from true to false', () => {
      // Arrange
      store.dispatch(toggleOpenAll()); // set to true first
      const expectedState: UIState = {
        activeItemId: undefined,
        showEditorModal: false,
        openAll: false,
      };

      // Act
      store.dispatch(toggleOpenAll());

      // Assert
      const state = store.getState().ui;
      expect(state).toEqual(expectedState);
    });
  });
});