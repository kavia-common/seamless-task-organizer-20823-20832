'use strict';
/**
 * Simple boot-time migration to ensure required tables exist.
 * This keeps the project simple without external migration tooling.
 */
const { getPool } = require('../config/db');

const CREATE_TASKS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  is_completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

async function runMigrations() {
  const pool = await getPool();
  await pool.query(CREATE_TASKS_TABLE_SQL);
}

module.exports = { runMigrations };
