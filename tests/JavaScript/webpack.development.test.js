const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const baseConfig = require('./webpack.config');

// Mock external dependencies
jest.mock('webpack-merge', () => ({
  merge: jest.fn(),
}));

jest.mock('@pmmmwh/react-refresh-webpack-plugin', () => {
  return jest.fn().mockImplementation(() => ({
    apply: jest.fn(),
  }));
});

describe('Webpack Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    // Preserve the original environment variables
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore the original environment variables
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  test('should merge baseConfig with devServer and plugins', () => {
    // Arrange
    const expectedDevtool = 'eval-cheap-module-source-map';
    const expectedHost = 'localhost';
    const expectedPort = 8080;

    // Act
    require('./webpack.dev.config');
    const configCall = merge.mock.calls[0][1];

    // Assert
    expect(merge).toHaveBeenCalledWith(baseConfig, expect.any(Object));
    expect(configCall.devtool).toBe(expectedDevtool);
    expect(configCall.devServer.host).toBe(expectedHost);
    expect(configCall.devServer.port).toBe(expectedPort);
    expect(configCall.plugins).toContainEqual(expect.any(ReactRefreshWebpackPlugin));
  });

  test('should use environment variables if set', () => {
    // Arrange
    process.env.DEVTOOL = 'eval-source-map';
    process.env.SERVE_HOST = '127.0.0.1';
    process.env.PORT = '3000';

    // Act
    require('./webpack.dev.config');
    const configCall = merge.mock.calls[0][1];

    // Assert
    expect(configCall.devtool).toBe('eval-source-map');
    expect(configCall.devServer.host).toBe('127.0.0.1');
    expect(configCall.devServer.port).toBe(3000);
  });

  test('should set correct devServer static directory', () => {
    // Act
    require('./webpack.dev.config');
    const configCall = merge.mock.calls[0][1];

    // Assert
    expect(configCall.devServer.static.directory).toBe(path.resolve(__dirname, 'static'));
  });

  test('should set hot and liveReload to true', () => {
    // Act
    require('./webpack.dev.config');
    const configCall = merge.mock.calls[0][1];

    // Assert
    expect(configCall.devServer.hot).toBe(true);
    expect(configCall.devServer.liveReload).toBe(true);
  });

  test('should configure proxy correctly', () => {
    // Act
    require('./webpack.dev.config');
    const configCall = merge.mock.calls[0][1];

    // Assert
    expect(configCall.devServer.proxy.context).toEqual(['/api/**', 'static/**']);
    expect(configCall.devServer.proxy.target).toBe('http://localhost:3000/');
    expect(configCall.devServer.proxy.secure).toBe(false);
  });

  test('should set correct headers in devServer', () => {
    // Act
    require('./webpack.dev.config');
    const configCall = merge.mock.calls[0][1];

    // Assert
    expect(configCall.devServer.headers).toEqual({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
    });
  });
});