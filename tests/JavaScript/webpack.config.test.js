const path = require('path');
const { EsbuildPlugin } = require('esbuild-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Webpack Configuration', () => {
  let sandbox;
  let processEnvBackup;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    processEnvBackup = { ...process.env };
  });

  afterEach(() => {
    sandbox.restore();
    process.env = processEnvBackup;
  });

  it('should set mode to development by default', () => {
    delete process.env.NODE_ENV;
    const config = require('./webpack.config');
    expect(config.mode).to.equal('development');
  });

  it('should set mode to production when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';
    const config = require('./webpack.config');
    expect(config.mode).to.equal('production');
  });

  it('should have correct entry point', () => {
    const config = require('./webpack.config');
    expect(config.entry).to.equal('./src/index.tsx');
  });

  it('should output to the correct directory', () => {
    const config = require('./webpack.config');
    expect(config.output.path).to.equal(path.resolve(__dirname, 'build'));
  });

  it('should include HtmlWebpackPlugin with correct options', () => {
    const config = require('./webpack.config');
    const htmlPlugin = config.plugins.find(plugin => plugin instanceof HtmlWebpackPlugin);
    expect(htmlPlugin).to.exist;
    expect(htmlPlugin.options.inject).to.be.true;
    expect(htmlPlugin.options.template).to.equal(path.resolve(__dirname, 'static/index.html'));
  });

  it('should include MiniCssExtractPlugin', () => {
    const config = require('./webpack.config');
    const miniCssPlugin = config.plugins.find(plugin => plugin instanceof MiniCssExtractPlugin);
    expect(miniCssPlugin).to.exist;
  });

  it('should include CspHtmlWebpackPlugin with correct hashing method', () => {
    const config = require('./webpack.config');
    const cspPlugin = config.plugins.find(plugin => plugin instanceof CspHtmlWebpackPlugin);
    expect(cspPlugin).to.exist;
    expect(cspPlugin.options.hashingMethod).to.equal('sha512');
  });

  it('should include TsconfigPathsPlugin in resolve plugins', () => {
    const config = require('./webpack.config');
    const tsconfigPlugin = config.resolve.plugins.find(plugin => plugin instanceof TsconfigPathsPlugin);
    expect(tsconfigPlugin).to.exist;
  });

  it('should include EsbuildPlugin in minimizer with correct options', () => {
    const config = require('./webpack.config');
    const esbuildPlugin = config.optimization.minimizer.find(plugin => plugin instanceof EsbuildPlugin);
    expect(esbuildPlugin).to.exist;
    expect(esbuildPlugin.options.target).to.equal('es6');
    expect(esbuildPlugin.options.css).to.be.true;
  });

  it('should define rules for TypeScript files', () => {
    const config = require('./webpack.config');
    const tsRule = config.module.rules.find(rule => rule.test.toString() === /\.tsx?$/i.toString());
    expect(tsRule).to.exist;
    expect(tsRule.loader).to.equal('swc-loader');
  });

  it('should define rules for SCSS files', () => {
    const config = require('./webpack.config');
    const scssRule = config.module.rules.find(rule => rule.test.toString() === /\.(sa|s?c)ss$/i.toString());
    expect(scssRule).to.exist;
    expect(scssRule.use).to.include.members([MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']);
  });

  it('should define asset type for various file formats', () => {
    const config = require('./webpack.config');
    const assetRule = config.module.rules.find(rule => rule.test.toString() === /\.(eot|woff2?|ttf|svg|png|jpe?g|gifv?|webp)$/i.toString());
    expect(assetRule).to.exist;
    expect(assetRule.type).to.equal('asset');
  });

  it('should clean output directory before building', () => {
    const config = require('./webpack.config');
    expect(config.output.clean).to.be.true;
  });

  it('should use single runtime chunk', () => {
    const config = require('./webpack.config');
    expect(config.optimization.runtimeChunk).to.equal('single');
  });

  it('should enable used exports optimization', () => {
    const config = require('./webpack.config');
    expect(config.optimization.usedExports).to.be.true;
  });
});