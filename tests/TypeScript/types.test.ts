import { UIState } from './uiState';
import { UUID } from '@mono/feature';

describe('UIState Tests', () => {

  describe('UIState Structure', () => {
    
    it('should create a UIState with default values', () => {
      // Arrange
      const defaultState: UIState = {
        activeItemId: undefined,
        showEditorModal: false,
        openAll: false
      };

      // Act
      const state: UIState = { ...defaultState };

      // Assert
      expect(state.activeItemId).toBeUndefined();
      expect(state.showEditorModal).toBe(false);
      expect(state.openAll).toBe(false);
    });

    it('should allow null for activeItemId', () => {
      // Arrange
      const nullActiveItemIdState: UIState = {
        activeItemId: null,
        showEditorModal: false,
        openAll: false
      };

      // Act
      const state: UIState = { ...nullActiveItemIdState };

      // Assert
      expect(state.activeItemId).toBeNull();
    });

    it('should set activeItemId with a valid UUID', () => {
      // Arrange
      const validUUID: UUID = '123e4567-e89b-12d3-a456-426614174000'; // Example UUID
      const validUUIDState: UIState = {
        activeItemId: validUUID,
        showEditorModal: false,
        openAll: false
      };

      // Act
      const state: UIState = { ...validUUIDState };

      // Assert
      expect(state.activeItemId).toBe(validUUID);
    });

    it('should set showEditorModal to true', () => {
      // Arrange
      const modalOpenState: UIState = {
        activeItemId: null,
        showEditorModal: true,
        openAll: false
      };

      // Act
      const state: UIState = { ...modalOpenState };

      // Assert
      expect(state.showEditorModal).toBe(true);
    });

    it('should set openAll to true', () => {
      // Arrange
      const openAllState: UIState = {
        activeItemId: null,
        showEditorModal: false,
        openAll: true
      };

      // Act
      const state: UIState = { ...openAllState };

      // Assert
      expect(state.openAll).toBe(true);
    });

  });

  describe('UIState Edge Cases', () => {

    it('should handle undefined activeItemId gracefully', () => {
      // Arrange
      const undefinedActiveItemIdState: UIState = {
        activeItemId: undefined,
        showEditorModal: false,
        openAll: false
      };

      // Act
      const state: UIState = { ...undefinedActiveItemIdState };

      // Assert
      expect(state.activeItemId).toBeUndefined();
    });

    it('should toggle showEditorModal state', () => {
      // Arrange
      let state: UIState = {
        activeItemId: null,
        showEditorModal: false,
        openAll: false
      };

      // Act
      state.showEditorModal = !state.showEditorModal;

      // Assert
      expect(state.showEditorModal).toBe(true);

      // Act
      state.showEditorModal = !state.showEditorModal;

      // Assert
      expect(state.showEditorModal).toBe(false);
    });

    it('should toggle openAll state', () => {
      // Arrange
      let state: UIState = {
        activeItemId: null,
        showEditorModal: false,
        openAll: false
      };

      // Act
      state.openAll = !state.openAll;

      // Assert
      expect(state.openAll).toBe(true);

      // Act
      state.openAll = !state.openAll;

      // Assert
      expect(state.openAll).toBe(false);
    });

  });

});