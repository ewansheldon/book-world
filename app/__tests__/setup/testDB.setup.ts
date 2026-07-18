import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { closeDb } from '@/app/lib/db';

let container: StartedPostgreSqlContainer;
let pool: Pool;

export const startTestDb = async () => {
  try {
    container = await new PostgreSqlContainer('postgres:16-alpine')
      .withDatabase('book_world_test')
      .withUsername('test')
      .withPassword('test')
      .start();
  } catch (e) {
    if (e instanceof Error && e.message.includes('Could not find a working container runtime strategy'))
      throw new Error('Docker not running')
  }

  process.env.DATABASE_URL = container.getConnectionUri();

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  for (const file of ['001_create_tables.sql', '002_drop_cover_url.sql', '003_add_description_to_books.sql', '004_add_tags.sql']) {
    const migration = fs.readFileSync(
      path.resolve(__dirname, '../../../migrations', file),
      'utf-8'
    );
    await pool.query(migration);
  }

  return pool;
};

export const stopTestDb = async () => {
  await closeDb();
  await pool?.end();
  await container?.stop();
};

export const clearDatabase = async () => {
  const pool = getTestPool();

  await pool.query(`
    TRUNCATE TABLE
      books
    RESTART IDENTITY
    CASCADE
  `);

  await pool.query(`
    TRUNCATE TABLE
      locations
    RESTART IDENTITY
    CASCADE
  `);

  await pool.query(`
    TRUNCATE TABLE
      tags
    RESTART IDENTITY
    CASCADE
  `);
}

export const getTestPool = (): Pool => pool;