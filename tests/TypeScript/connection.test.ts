import { Pool } from 'pg';
import { conn } from './path-to-your-file'; // Adjust the import path as necessary
import dotenv from 'dotenv';

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Database Connection Pool', () => {
  const mockEnv = {
    POSTGRES_USER: 'test_user',
    POSTGRES_PASSWORD: 'test_password',
    POSTGRES_DB: 'test_db',
    POSTGRES_PORT: '5432',
  };

  beforeAll(() => {
    process.env = { ...process.env, ...mockEnv };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should configure dotenv with the correct path', () => {
    expect(dotenv.config).toHaveBeenCalledWith({
      path: expect.stringContaining('.env'),
    });
  });

  it('should initialize a new Pool instance with environment variables', () => {
    expect(Pool).toHaveBeenCalledWith({
      user: mockEnv.POSTGRES_USER,
      password: mockEnv.POSTGRES_PASSWORD,
      database: mockEnv.POSTGRES_DB,
      port: parseInt(mockEnv.POSTGRES_PORT, 10),
    });
  });

  it('should use default port if POSTGRES_PORT is not defined', () => {
    delete process.env.POSTGRES_PORT;
    jest.resetModules();
    require('./path-to-your-file'); // Re-import the module to apply new env
    expect(Pool).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 5432, // Default port
      })
    );
  });

  it('should throw an error if required environment variables are missing', () => {
    delete process.env.POSTGRES_USER;
    jest.resetModules();
    expect(() => require('./path-to-your-file')).toThrow();
  });

  it('should handle database connection errors gracefully', async () => {
    const poolInstance = new Pool();
    poolInstance.connect.mockImplementation(() => {
      throw new Error('Connection failed');
    });

    try {
      await poolInstance.connect();
    } catch (error) {
      expect(error.message).toBe('Connection failed');
    }
  });

  it('should close the pool connection without errors', async () => {
    const poolInstance = new Pool();
    await poolInstance.end();
    expect(poolInstance.end).toHaveBeenCalled();
  });
});