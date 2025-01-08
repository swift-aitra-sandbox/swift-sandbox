const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const { EsbuildPlugin } = require('esbuild-loader');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

jest.mock('html-webpack-plugin');
jest.mock('mini-css-extract-plugin');
jest.mock('csp-html-webpack-plugin');
jest.mock('esbuild-loader');
jest.mock('tsconfig-paths-webpack-plugin');
jest.mock('path');

describe('Webpack Configuration', () => {
  let baseConfig;

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'development';
    baseConfig = require('./webpack.config'); // Adjust path as necessary
  });

  test('should set mode based on NODE_ENV', () => {
    expect(baseConfig.mode).toBe('development');
    process.env.NODE_ENV = 'production';
    baseConfig = require('./webpack.config');
    expect(baseConfig.mode).toBe('production');
  });

  test('should have correct entry point', () => {
    expect(baseConfig.entry).toBe('./src/index.tsx');
  });

  test('should resolve correct output path', () => {
    expect(path.resolve).toHaveBeenCalledWith(__dirname, 'build');
  });

  test('should include TsconfigPathsPlugin in resolve plugins', () => {
    expect(baseConfig.resolve.plugins).toContainEqual(expect.any(TsconfigPathsPlugin));
  });

  test('should have correct module rules for TypeScript', () => {
    const tsRule = baseConfig.module.rules.find(rule => /\.tsx?$/.test(rule.test));
    expect(tsRule.loader).toBe('swc-loader');
  });

  test('should have correct module rules for SCSS', () => {
    const scssRule = baseConfig.module.rules.find(rule => /\.(sa|s?c)ss$/i.test(rule.test));
    expect(scssRule.use).toEqual(expect.arrayContaining([
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ]));
  });

  test('should have correct module rules for assets', () => {
    const assetRule = baseConfig.module.rules.find(rule => /\.(eot|woff2?|ttf|svg|png|jpe?g|gifv?|webp)$/i.test(rule.test));
    expect(assetRule.type).toBe('asset');
    expect(assetRule.generator.filename).toBe('static/[hash][ext][query]');
  });

  test('should include HtmlWebpackPlugin with correct options', () => {
    expect(HtmlWebpackPlugin).toHaveBeenCalledWith({
      inject: true,
      template: path.resolve(__dirname, 'static/index.html'),
      hash: true,
      minify: false // Because NODE_ENV is 'development'
    });
  });

  test('should include MiniCssExtractPlugin', () => {
    expect(baseConfig.plugins).toContainEqual(expect.any(MiniCssExtractPlugin));
  });

  test('should include CspHtmlWebpackPlugin with correct options', () => {
    expect(CspHtmlWebpackPlugin).toHaveBeenCalledWith(
      {},
      {
        hashingMethod: 'sha512',
        hashEnabled: {
          'style-src': true // Because NODE_ENV is 'development'
        }
      }
    );
  });

  test('should include EsbuildPlugin in minimizer with correct options', () => {
    expect(baseConfig.optimization.minimizer).toContainEqual(expect.any(EsbuildPlugin));
  });

  test('should set optimization runtimeChunk to single', () => {
    expect(baseConfig.optimization.runtimeChunk).toBe('single');
  });

  test('should enable usedExports for optimization', () => {
    expect(baseConfig.optimization.usedExports).toBe(true);
  });
});