import config from './path/to/config';
import { InitialOptionsTsJest } from 'ts-jest';

describe('Jest Configuration', () => {
  it('should have clearMocks set to true', () => {
    // Arrange & Act
    const { clearMocks } = config;

    // Assert
    expect(clearMocks).toBe(true);
  });

  it('should have coverageDirectory set to "coverage"', () => {
    // Arrange & Act
    const { coverageDirectory } = config;

    // Assert
    expect(coverageDirectory).toBe('coverage');
  });

  it('should have coverageProvider set to "babel"', () => {
    // Arrange & Act
    const { coverageProvider } = config;

    // Assert
    expect(coverageProvider).toBe('babel');
  });

  it('should have a valid globals configuration', () => {
    // Arrange & Act
    const { globals } = config;

    // Assert
    expect(globals).toHaveProperty('ts-jest');
    expect(globals['ts-jest']).toHaveProperty('babelConfig', true);
  });

  it('should include specific moduleFileExtensions', () => {
    // Arrange & Act
    const { moduleFileExtensions } = config;

    // Assert
    expect(moduleFileExtensions).toEqual(
      expect.arrayContaining(['ts', 'tsx', 'js', 'jsx', 'json', 'node'])
    );
  });

  it('should have preset set to "ts-jest"', () => {
    // Arrange & Act
    const { preset } = config;

    // Assert
    expect(preset).toBe('ts-jest');
  });

  it('should have roots defined correctly', () => {
    // Arrange & Act
    const { roots } = config;

    // Assert
    expect(roots).toEqual([
      '<rootDir>/app',
      '<rootDir>/server',
      '<rootDir>/common',
    ]);
  });

  it('should have setupFilesAfterEnv configured correctly', () => {
    // Arrange & Act
    const { setupFilesAfterEnv } = config;

    // Assert
    expect(setupFilesAfterEnv).toEqual([
      '@testing-library/jest-dom/extend-expect',
    ]);
  });

  it('should use "jsdom" as the test environment', () => {
    // Arrange & Act
    const { testEnvironment } = config;

    // Assert
    expect(testEnvironment).toBe('jsdom');
  });

  it('should have correct testRegex pattern', () => {
    // Arrange & Act
    const { testRegex } = config;

    // Assert
    expect(testRegex).toEqual(['(.*/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$']);
  });

  it('should have transform configuration for ts-jest', () => {
    // Arrange & Act
    const { transform } = config;

    // Assert
    expect(transform).toHaveProperty('^.+\\.tsx?$', 'ts-jest');
  });

  it('should match the InitialOptionsTsJest type', () => {
    // Arrange & Act
    const configTypeCheck: InitialOptionsTsJest = config;

    // Assert
    expect(configTypeCheck).toBeDefined();
  });
});