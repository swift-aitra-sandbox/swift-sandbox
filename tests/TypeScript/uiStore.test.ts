import { configureStore } from '@reduxjs/toolkit';
import { uiReducer, setActiveItemId, toggleEditorModal, toggleOpenAll } from './path-to-your-slice';
import type { UIState } from './path-to-your-types';
import type { UUID } from '@mono/feature';

describe('uiSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: uiReducer });
  });

  describe('setActiveItemId', () => {
    it('should set activeItemId to a valid UUID', () => {
      // Arrange
      const validUUID: UUID = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      store.dispatch(setActiveItemId(validUUID));

      // Assert
      const state: UIState = store.getState();
      expect(state.activeItemId).toBe(validUUID);
    });

    it('should set activeItemId to null', () => {
      // Arrange
      const nullUUID = null;

      // Act
      store.dispatch(setActiveItemId(nullUUID));

      // Assert
      const state: UIState = store.getState();
      expect(state.activeItemId).toBe(nullUUID);
    });

    it('should set activeItemId to undefined', () => {
      // Act
      store.dispatch(setActiveItemId(undefined));

      // Assert
      const state: UIState = store.getState();
      expect(state.activeItemId).toBeUndefined();
    });
  });

  describe('toggleEditorModal', () => {
    it('should toggle showEditorModal from false to true', () => {
      // Act
      store.dispatch(toggleEditorModal());

      // Assert
      const state: UIState = store.getState();
      expect(state.showEditorModal).toBe(true);
    });

    it('should toggle showEditorModal from true to false', () => {
      // Arrange
      store.dispatch(toggleEditorModal());

      // Act
      store.dispatch(toggleEditorModal());

      // Assert
      const state: UIState = store.getState();
      expect(state.showEditorModal).toBe(false);
    });
  });

  describe('toggleOpenAll', () => {
    it('should toggle openAll from false to true', () => {
      // Act
      store.dispatch(toggleOpenAll());

      // Assert
      const state: UIState = store.getState();
      expect(state.openAll).toBe(true);
    });

    it('should toggle openAll from true to false', () => {
      // Arrange
      store.dispatch(toggleOpenAll());

      // Act
      store.dispatch(toggleOpenAll());

      // Assert
      const state: UIState = store.getState();
      expect(state.openAll).toBe(false);
    });
  });
});