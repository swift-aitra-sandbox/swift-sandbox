const { describe, it, beforeEach } = require('mocha');
const { expect } = require('chai');
const proxyquire = require('proxyquire').noCallThru();

describe('Tailwind Configuration Module', function() {
  let config;

  beforeEach(function() {
    config = proxyquire('./path/to/config', {
      '@tailwindcss/forms': () => ({})
    });
  });

  it('should have correct content paths', function() {
    expect(config.content).to.deep.equal(['./src/**/*.{html,ts,tsx}'], 'Content paths are not as expected');
  });

  it('should extend theme with an empty object', function() {
    expect(config.theme.extend).to.deep.equal({}, 'Theme extension is not an empty object');
  });

  it('should include @tailwindcss/forms plugin', function() {
    expect(config.plugins).to.have.lengthOf(1, 'Plugins array does not have the expected length');
    expect(config.plugins[0]).to.be.a('function', 'Plugin is not a function');
  });

  it('should handle missing plugins gracefully', function() {
    const brokenConfig = proxyquire('./path/to/config', {
      '@tailwindcss/forms': null
    });
    expect(brokenConfig.plugins).to.be.an('array').that.is.empty;
  });

  it('should throw an error if content paths are not defined', function() {
    const brokenConfig = proxyquire('./path/to/config', {
      './src/**/*.{html,ts,tsx}': null
    });
    expect(() => brokenConfig.content).to.throw('Content paths are not defined');
  });

  it('should have a theme object defined', function() {
    expect(config.theme).to.be.an('object', 'Theme is not an object');
  });
});