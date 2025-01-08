const tailwindConfig = require('./path/to/tailwindConfig');
const { describe, test, expect } = require('@jest/globals');

describe('Tailwind Configuration', () => {

  test('should contain correct content paths', () => {
    // Arrange
    const expectedContent = ['./src/**/*.{html,ts,tsx}'];

    // Act
    const actualContent = tailwindConfig.content;

    // Assert
    expect(actualContent).toEqual(expectedContent);
  });

  test('should have an empty theme extension', () => {
    // Arrange
    const expectedThemeExtension = {};

    // Act
    const actualThemeExtension = tailwindConfig.theme.extend;

    // Assert
    expect(actualThemeExtension).toEqual(expectedThemeExtension);
  });

  test('should include @tailwindcss/forms plugin', () => {
    // Arrange
    const expectedPlugin = '@tailwindcss/forms';

    // Act
    const actualPlugins = tailwindConfig.plugins.map(plugin => plugin.name);

    // Assert
    expect(actualPlugins).toContain(expectedPlugin);
  });

  test('should throw error if content is not an array', () => {
    // Arrange
    const invalidConfig = {
      ...tailwindConfig,
      content: 'invalid/path'
    };

    // Act & Assert
    expect(() => {
      validateTailwindConfig(invalidConfig);
    }).toThrow('Content paths should be an array');
  });

  test('should throw error if theme extension is not an object', () => {
    // Arrange
    const invalidConfig = {
      ...tailwindConfig,
      theme: {
        extend: 'invalid'
      }
    };

    // Act & Assert
    expect(() => {
      validateTailwindConfig(invalidConfig);
    }).toThrow('Theme extension should be an object');
  });

  test('should throw error if plugins contain invalid plugin', () => {
    // Arrange
    const invalidConfig = {
      ...tailwindConfig,
      plugins: [() => {}]
    };

    // Act & Assert
    expect(() => {
      validateTailwindConfig(invalidConfig);
    }).toThrow('Invalid plugin configuration');
  });

  // Mock function for configuration validation
  function validateTailwindConfig(config) {
    if (!Array.isArray(config.content)) {
      throw new Error('Content paths should be an array');
    }
    if (typeof config.theme.extend !== 'object') {
      throw new Error('Theme extension should be an object');
    }
    if (config.plugins.some(plugin => typeof plugin !== 'function')) {
      throw new Error('Invalid plugin configuration');
    }
  }
});