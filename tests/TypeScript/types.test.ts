import { describe, it, expect } from '@jest/globals';
import { UIState } from './path-to-your-file'; // Adjust the import path as necessary

describe('UIState Type Tests', () => {

  it('should allow activeItemId to be a valid UUID', () => {
    const uiState: UIState = {
      activeItemId: '123e4567-e89b-12d3-a456-426614174000', // Example UUID
      showEditorModal: false,
      openAll: false
    };
    expect(uiState.activeItemId).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should allow activeItemId to be null', () => {
    const uiState: UIState = {
      activeItemId: null,
      showEditorModal: false,
      openAll: false
    };
    expect(uiState.activeItemId).toBeNull();
  });

  it('should allow activeItemId to be undefined', () => {
    const uiState: UIState = {
      activeItemId: undefined,
      showEditorModal: false,
      openAll: false
    };
    expect(uiState.activeItemId).toBeUndefined();
  });

  it('should correctly set showEditorModal to true', () => {
    const uiState: UIState = {
      activeItemId: null,
      showEditorModal: true,
      openAll: false
    };
    expect(uiState.showEditorModal).toBe(true);
  });

  it('should correctly set showEditorModal to false', () => {
    const uiState: UIState = {
      activeItemId: null,
      showEditorModal: false,
      openAll: false
    };
    expect(uiState.showEditorModal).toBe(false);
  });

  it('should correctly set openAll to true', () => {
    const uiState: UIState = {
      activeItemId: null,
      showEditorModal: false,
      openAll: true
    };
    expect(uiState.openAll).toBe(true);
  });

  it('should correctly set openAll to false', () => {
    const uiState: UIState = {
      activeItemId: null,
      showEditorModal: false,
      openAll: false
    };
    expect(uiState.openAll).toBe(false);
  });

  it('should handle edge case where all properties are falsy', () => {
    const uiState: UIState = {
      activeItemId: undefined,
      showEditorModal: false,
      openAll: false
    };
    expect(uiState.activeItemId).toBeUndefined();
    expect(uiState.showEditorModal).toBe(false);
    expect(uiState.openAll).toBe(false);
  });

  it('should handle edge case where all properties are truthy', () => {
    const uiState: UIState = {
      activeItemId: '123e4567-e89b-12d3-a456-426614174000',
      showEditorModal: true,
      openAll: true
    };
    expect(uiState.activeItemId).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(uiState.showEditorModal).toBe(true);
    expect(uiState.openAll).toBe(true);
  });

});