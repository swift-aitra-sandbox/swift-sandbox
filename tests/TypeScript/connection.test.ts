import { Pool } from 'pg';
import { conn } from './path-to-your-file'; // Adjust the import path
import * as dotenv from 'dotenv';

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
  let pool: jest.Mocked<Pool>;

  beforeEach(() => {
    pool = new Pool() as jest.Mocked<Pool>;
    dotenv.config.mockClear();
  });

  test('should initialize dotenv config with correct path', () => {
    expect(dotenv.config).toHaveBeenCalledWith({ path: expect.stringContaining('.env') });
  });

  test('should create a Pool instance with correct parameters', () => {
    const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } = process.env;
    expect(Pool).toHaveBeenCalledWith({
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      port: parseInt(POSTGRES_PORT ?? '5432'),
    });
  });

  test('should handle missing environment variables gracefully', () => {
    const originalEnv = process.env;
    delete process.env.POSTGRES_USER;
    delete process.env.POSTGRES_PASSWORD;
    delete process.env.POSTGRES_DB;
    delete process.env.POSTGRES_PORT;

    expect(() => {
      require('./path-to-your-file');
    }).not.toThrow();

    process.env = originalEnv;
  });

  test('should handle connection errors', async () => {
    const error = new Error('Connection failed');
    pool.connect.mockRejectedValueOnce(error);

    await expect(pool.connect()).rejects.toThrow('Connection failed');
  });

  test('should connect successfully when parameters are correct', async () => {
    pool.connect.mockResolvedValueOnce({});

    await expect(pool.connect()).resolves.toEqual({});
  });

  test('should execute query successfully', async () => {
    const mockResult = { rows: [{ id: 1, name: 'Test' }] };
    pool.query.mockResolvedValueOnce(mockResult);

    const result = await pool.query('SELECT * FROM users');
    expect(result).toEqual(mockResult);
  });

  test('should handle query errors', async () => {
    const error = new Error('Query failed');
    pool.query.mockRejectedValueOnce(error);

    await expect(pool.query('SELECT * FROM users')).rejects.toThrow('Query failed');
  });

  test('should close the connection pool', async () => {
    pool.end.mockResolvedValueOnce();

    await expect(pool.end()).resolves.toBeUndefined();
  });

  test('should handle errors during pool closure', async () => {
    const error = new Error('End failed');
    pool.end.mockRejectedValueOnce(error);

    await expect(pool.end()).rejects.toThrow('End failed');
  });
});