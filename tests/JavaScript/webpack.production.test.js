const { optimize: WebpackOptimize } = require('webpack');
const { ModuleConcatenationPlugin } = WebpackOptimize;
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config');

jest.mock('webpack', () => ({
  optimize: {
    ModuleConcatenationPlugin: jest.fn()
  }
}));

jest.mock('webpack-merge', () => ({
  merge: jest.fn()
}));

jest.mock('./webpack.config', () => ({
  mode: 'development'
}));

describe('Webpack Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env;
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
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
    const config = require('./config');

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expectedConfig);
  });

  test('should use default devtool when DEVTOOL is not set', () => {
    // Arrange
    delete process.env.DEVTOOL;

    // Act
    const config = require('./config');

    // Assert
    expect(config.devtool).toBe('nosources-source-map');
  });

  test('should use environment variable DEVTOOL if set', () => {
    // Arrange
    process.env.DEVTOOL = 'source-map';

    // Act
    const config = require('./config');

    // Assert
    expect(config.devtool).toBe('source-map');
  });

  test('should include ModuleConcatenationPlugin in plugins', () => {
    // Arrange & Act
    const config = require('./config');

    // Assert
    expect(config.plugins).toContainEqual(expect.any(ModuleConcatenationPlugin));
  });

  test('should throw error if baseConfig is not valid', () => {
    // Arrange
    jest.mock('./webpack.config', () => {
      throw new Error('Invalid configuration');
    });

    // Act & Assert
    expect(() => require('./config')).toThrow('Invalid configuration');
  });
});