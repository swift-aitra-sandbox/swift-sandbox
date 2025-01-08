const { optimize: WebpackOptimize } = require('webpack');
const { ModuleConcatenationPlugin } = WebpackOptimize;
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config');
const config = require('./path/to/your/config'); // Adjust the path as necessary

jest.mock('webpack', () => ({
  optimize: {
    ModuleConcatenationPlugin: jest.fn(),
  },
}));

jest.mock('webpack-merge', () => ({
  merge: jest.fn(),
}));

jest.mock('./webpack.config', () => ({
  // Mock your baseConfig object here if necessary
}));

describe('Webpack Configuration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DEVTOOL = undefined; // Reset environment variable
  });

  test('should merge baseConfig with production settings', () => {
    // Arrange
    const expectedConfig = {
      mode: 'production',
      devtool: 'nosources-source-map',
      optimization: {
        concatenateModules: true,
      },
      plugins: [new ModuleConcatenationPlugin()],
    };

    // Act
    const result = config;

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expectedConfig);
  });

  test('should use DEVTOOL environment variable if set', () => {
    // Arrange
    process.env.DEVTOOL = 'source-map';

    // Act
    const result = config;

    // Assert
    expect(result.devtool).toBe('source-map');
  });

  test('should default to "nosources-source-map" if DEVTOOL is not set', () => {
    // Act
    const result = config;

    // Assert
    expect(result.devtool).toBe('nosources-source-map');
  });

  test('should include ModuleConcatenationPlugin in plugins', () => {
    // Act
    const result = config;

    // Assert
    expect(result.plugins).toContainEqual(expect.any(ModuleConcatenationPlugin));
  });

  test('should handle empty baseConfig gracefully', () => {
    // Arrange
    jest.mock('./webpack.config', () => ({}));

    // Act
    const result = require('./path/to/your/config');

    // Assert
    expect(result).toBeDefined();
    expect(result.mode).toBe('production');
  });

  test('should throw error if merge fails', () => {
    // Arrange
    merge.mockImplementation(() => {
      throw new Error('Merge failed');
    });

    // Act & Assert
    expect(() => require('./path/to/your/config')).toThrow('Merge failed');
  });
});