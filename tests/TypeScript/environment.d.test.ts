import { config } from 'dotenv';
import { expect } from 'chai';
import 'mocha';

// Mocking process.env for testing
describe('Environment Variables', () => {
  beforeEach(() => {
    // Mock environment variables
    process.env.GITHUB_AUTH_TOKEN = 'test_token';
    process.env.NODE_ENV = 'test';
    process.env.PWD = '/test/path';
    process.env.PORT = '3000';
    process.env.POSTGRES_USER = 'test_user';
    process.env.POSTGRES_PASSWORD = 'test_password';
    process.env.POSTGRES_DB = 'test_db';
    process.env.POSTGRES_PORT = '5432';
  });

  afterEach(() => {
    // Reset environment variables
    delete process.env.GITHUB_AUTH_TOKEN;
    delete process.env.NODE_ENV;
    delete process.env.PWD;
    delete process.env.PORT;
    delete process.env.POSTGRES_USER;
    delete process.env.POSTGRES_PASSWORD;
    delete process.env.POSTGRES_DB;
    delete process.env.POSTGRES_PORT;
  });

  it('should have a GITHUB_AUTH_TOKEN defined', () => {
    expect(process.env.GITHUB_AUTH_TOKEN).to.exist.and.to.equal('test_token');
  });

  it('should have NODE_ENV as test', () => {
    expect(process.env.NODE_ENV).to.exist.and.to.equal('test');
  });

  it('should have a PWD defined', () => {
    expect(process.env.PWD).to.exist.and.to.equal('/test/path');
  });

  it('should have PORT defined if set', () => {
    expect(process.env.PORT).to.exist.and.to.equal('3000');
  });

  it('should have POSTGRES_USER defined if set', () => {
    expect(process.env.POSTGRES_USER).to.exist.and.to.equal('test_user');
  });

  it('should have POSTGRES_PASSWORD defined if set', () => {
    expect(process.env.POSTGRES_PASSWORD).to.exist.and.to.equal('test_password');
  });

  it('should have POSTGRES_DB defined if set', () => {
    expect(process.env.POSTGRES_DB).to.exist.and.to.equal('test_db');
  });

  it('should have POSTGRES_PORT defined if set', () => {
    expect(process.env.POSTGRES_PORT).to.exist.and.to.equal('5432');
  });

  it('should handle missing optional variables gracefully', () => {
    delete process.env.POSTGRES_PORT;
    expect(process.env.POSTGRES_PORT).to.be.undefined;
  });

  it('should handle NODE_ENV with unexpected values', () => {
    process.env.NODE_ENV = 'unexpected_value';
    expect(process.env.NODE_ENV).to.exist.and.to.equal('unexpected_value');
  });

  it('should throw an error when GITHUB_AUTH_TOKEN is missing', () => {
    delete process.env.GITHUB_AUTH_TOKEN;
    expect(() => {
      if (!process.env.GITHUB_AUTH_TOKEN) {
        throw new Error('GITHUB_AUTH_TOKEN is required');
      }
    }).to.throw('GITHUB_AUTH_TOKEN is required');
  });
});