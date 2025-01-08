import config from './config'; // Assuming the config file is named config.ts
import { InitialOptionsTsJest } from 'ts-jest';

describe('Jest Configuration Tests', () => {
  
  it('should have clearMocks set to true', () => {
    // Arrange & Act
    const clearMocks = config.clearMocks;
    
    // Assert
    expect(clearMocks).toBe(true);
  });

  it('should have the correct coverageDirectory', () => {
    // Arrange & Act
    const coverageDirectory = config.coverageDirectory;
    
    // Assert
    expect(coverageDirectory).toBe('coverage');
  });

  it('should use babel as the coverageProvider', () => {
    // Arrange & Act
    const coverageProvider = config.coverageProvider;
    
    // Assert
    expect(coverageProvider).toBe('babel');
  });

  it('should have ts-jest preset configured', () => {
    // Arrange & Act
    const preset = config.preset;
    
    // Assert
    expect(preset).toBe('ts-jest');
  });

  it('should have the correct testEnvironment set', () => {
    // Arrange & Act
    const testEnvironment = config.testEnvironment;
    
    // Assert
    expect(testEnvironment).toBe('jsdom');
  });

  it('should have the correct roots configuration', () => {
    // Arrange & Act
    const roots = config.roots;
    
    // Assert
    expect(roots).toEqual(['<rootDir>/app', '<rootDir>/server', '<rootDir>/common']);
  });

  it('should have the correct testRegex pattern', () => {
    // Arrange & Act
    const testRegex = config.testRegex;
    
    // Assert
    expect(testRegex).toEqual(['(.*/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$']);
  });

  it('should have the correct moduleFileExtensions', () => {
    // Arrange & Act
    const moduleFileExtensions = config.moduleFileExtensions;
    
    // Assert
    expect(moduleFileExtensions).toEqual(['ts', 'tsx', 'js', 'jsx', 'json', 'node']);
  });

  it('should have setupFilesAfterEnv correctly configured', () => {
    // Arrange & Act
    const setupFilesAfterEnv = config.setupFilesAfterEnv;
    
    // Assert
    expect(setupFilesAfterEnv).toEqual(['@testing-library/jest-dom/extend-expect']);
  });

  it('should have transform configuration for TypeScript', () => {
    // Arrange & Act
    const transform = config.transform;
    
    // Assert
    expect(transform).toEqual({ '^.+\\.tsx?$': 'ts-jest' });
  });

  it('should have globals configured for ts-jest with babelConfig', () => {
    // Arrange & Act
    const globals = config.globals;
    
    // Assert
    expect(globals).toEqual({ 'ts-jest': { babelConfig: true } });
  });

});