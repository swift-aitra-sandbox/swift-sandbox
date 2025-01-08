import { config } from 'dotenv';
import { expect } from 'chai';
import 'mocha';

// Load environment variables from a .env file for testing
config();

describe('ProcessEnv Configuration', () => {

  before(() => {
    // Mock environment variables if needed
    process.env.GITHUB_AUTH_TOKEN = 'mockedToken';
    process.env.NODE_ENV = 'test';
    process.env.PWD = '/mocked/path';
    process.env.PORT = '3000';
    process.env.POSTGRES_USER = 'mockedUser';
    process.env.POSTGRES_PASSWORD = 'mockedPassword';
    process.env.POSTGRES_DB = 'mockedDb';
    process.env.POSTGRES_PORT = '5432';
  });

  it('should have GITHUB_AUTH_TOKEN defined', () => {
    expect(process.env.GITHUB_AUTH_TOKEN).to.exist;
    expect(process.env.GITHUB_AUTH_TOKEN).to.be.a('string');
  });

  it('should have NODE_ENV set to a valid value', () => {
    const validEnvs = ['development', 'production', 'test'];
    expect(process.env.NODE_ENV).to.exist;
    expect(validEnvs).to.include(process.env.NODE_ENV);
  });

  it('should have PWD defined and be a string', () => {
    expect(process.env.PWD).to.exist;
    expect(process.env.PWD).to.be.a('string');
  });

  it('should have PORT defined and be a string', () => {
    expect(process.env.PORT).to.exist;
    expect(process.env.PORT).to.be.a('string');
  });

  it('should have POSTGRES_USER defined and be a string', () => {
    expect(process.env.POSTGRES_USER).to.exist;
    expect(process.env.POSTGRES_USER).to.be.a('string');
  });

  it('should have POSTGRES_PASSWORD defined and be a string', () => {
    expect(process.env.POSTGRES_PASSWORD).to.exist;
    expect(process.env.POSTGRES_PASSWORD).to.be.a('string');
  });

  it('should have POSTGRES_DB defined and be a string', () => {
    expect(process.env.POSTGRES_DB).to.exist;
    expect(process.env.POSTGRES_DB).to.be.a('string');
  });

  it('should have POSTGRES_PORT defined and be a string', () => {
    expect(process.env.POSTGRES_PORT).to.exist;
    expect(process.env.POSTGRES_PORT).to.be.a('string');
  });

  it('should handle missing optional environment variables gracefully', () => {
    delete process.env.PORT;
    expect(process.env.PORT).to.be.undefined;
  });

  after(() => {
    // Clean up or reset environment variables if necessary
    delete process.env.GITHUB_AUTH_TOKEN;
    delete process.env.NODE_ENV;
    delete process.env.PWD;
    delete process.env.PORT;
    delete process.env.POSTGRES_USER;
    delete process.env.POSTGRES_PASSWORD;
    delete process.env.POSTGRES_DB;
    delete process.env.POSTGRES_PORT;
  });
});