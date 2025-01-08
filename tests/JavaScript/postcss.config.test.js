const { expect } = require('chai');

describe('PostCSS Plugins Configuration', () => {
  let config;

  beforeEach(() => {
    config = require('./path/to/your/config'); // Adjust path to the actual config file
  });

  describe('Configuration Structure', () => {
    it('should have a plugins property', () => {
      expect(config).to.have.property('plugins');
    });

    it('should have tailwindcss and autoprefixer as plugins', () => {
      expect(config.plugins).to.have.property('tailwindcss');
      expect(config.plugins).to.have.property('autoprefixer');
    });

    it('should have tailwindcss and autoprefixer as objects', () => {
      expect(config.plugins.tailwindcss).to.be.an('object');
      expect(config.plugins.autoprefixer).to.be.an('object');
    });
  });

  describe('Negative Scenarios', () => {
    it('should not have an unexpected plugin', () => {
      expect(config.plugins).to.not.have.property('unexpectedPlugin');
    });

    it('should throw an error if trying to access a non-existent property', () => {
      expect(() => config.plugins.nonExistentProperty).to.throw(TypeError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty plugin configuration gracefully', () => {
      config.plugins = {};
      expect(config.plugins).to.be.empty;
    });

    it('should handle null plugin configuration gracefully', () => {
      config.plugins = null;
      expect(config.plugins).to.be.null;
    });
  });
});