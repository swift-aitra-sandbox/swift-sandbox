const { merge } = require('webpack-merge');
const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const baseConfig = require('./webpack.config');
const configModule = require('./path-to-config-file'); // Adjust path as necessary

jest.mock('webpack-merge', () => ({
  merge: jest.fn(),
}));

jest.mock('@pmmmwh/react-refresh-webpack-plugin', () => jest.fn());

jest.mock('path', () => ({
  resolve: jest.fn((...args) => args.join('/')),
}));

jest.mock('./webpack.config', () => ({
  // Mock baseConfig structure
}));

describe('Webpack Configuration', () => {
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should merge baseConfig with devServer settings', () => {
    // Arrange
    process.env.DEVTOOL = 'eval';
    process.env.SERVE_HOST = '127.0.0.1';
    process.env.PORT = '3000';

    // Act
    const config = configModule;

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.objectContaining({
      devtool: 'eval',
      devServer: expect.objectContaining({
        host: '127.0.0.1',
        port: 3000,
      }),
    }));
  });

  test('should use default devtool if not specified', () => {
    // Arrange
    delete process.env.DEVTOOL;

    // Act
    const config = configModule;

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.objectContaining({
      devtool: 'eval-cheap-module-source-map',
    }));
  });

  test('should use default host and port if not specified', () => {
    // Arrange
    delete process.env.SERVE_HOST;
    delete process.env.PORT;

    // Act
    const config = configModule;

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.objectContaining({
      devServer: expect.objectContaining({
        host: 'localhost',
        port: 8080,
      }),
    }));
  });

  test('should resolve static directory path', () => {
    // Arrange
    const expectedPath = '__dirname/static';

    // Act
    const config = configModule;

    // Assert
    expect(path.resolve).toHaveBeenCalledWith('__dirname', 'static');
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.objectContaining({
      devServer: expect.objectContaining({
        static: expect.objectContaining({
          directory: expectedPath,
        }),
      }),
    }));
  });

  test('should include ReactRefreshWebpackPlugin in plugins', () => {
    // Act
    const config = configModule;

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.objectContaining({
      plugins: expect.arrayContaining([expect.any(ReactRefreshWebpackPlugin)]),
    }));
  });

  test('should set proxy settings correctly', () => {
    // Act
    const config = configModule;

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.objectContaining({
      devServer: expect.objectContaining({
        proxy: expect.objectContaining({
          context: ['/api/**', 'static/**'],
          target: 'http://localhost:3000/',
          secure: false,
        }),
      }),
    }));
  });
});