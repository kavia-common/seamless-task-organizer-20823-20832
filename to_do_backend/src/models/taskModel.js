'use strict';
/**
 * TaskModel encapsulates SQL operations for tasks.
 */
const { getPool } = require('../config/db');

class TaskModel {
  // PUBLIC_INTERFACE
  static async list({ q } = {}) {
    /**
     * List tasks with optional simple search on title.
     */
    const pool = await getPool();
    if (q) {
      const [rows] = await pool.query(
        'SELECT id, title, description, is_completed AS isCompleted, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE title LIKE :q ORDER BY created_at DESC',
        { q: `%${q}%` }
      );
      return rows;
    }
    const [rows] = await pool.query(
      'SELECT id, title, description, is_completed AS isCompleted, created_at AS createdAt, updated_at AS updatedAt FROM tasks ORDER BY created_at DESC'
    );
    return rows;
  }

  // PUBLIC_INTERFACE
  static async getById(id) {
    /** Get a single task by id. */
    const pool = await getPool();
    const [rows] = await pool.query(
      'SELECT id, title, description, is_completed AS isCompleted, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE id = :id',
      { id }
    );
    return rows[0] || null;
  }

  // PUBLIC_INTERFACE
  static async create({ title, description = null }) {
    /** Create a new task. */
    const pool = await getPool();
    const [result] = await pool.query(
      'INSERT INTO tasks (title, description, is_completed) VALUES (:title, :description, 0)',
      { title, description }
    );
    return this.getById(result.insertId);
  }

  // PUBLIC_INTERFACE
  static async update(id, { title, description, isCompleted }) {
    /**
     * Update an existing task. Fields are optional (partial update).
     */
    const pool = await getPool();

    // Build dynamic update set
    const fields = [];
    const params = { id };
    if (title !== undefined) {
      fields.push('title = :title');
      params.title = title;
    }
    if (description !== undefined) {
      fields.push('description = :description');
      params.description = description;
    }
    if (isCompleted !== undefined) {
      fields.push('is_completed = :is_completed');
      params.is_completed = isCompleted ? 1 : 0;
    }

    if (fields.length === 0) {
      return this.getById(id);
    }

    const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = :id`;
    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) return null;
    return this.getById(id);
  }

  // PUBLIC_INTERFACE
  static async remove(id) {
    /** Delete a task by id. */
    const pool = await getPool();
    const [result] = await pool.query('DELETE FROM tasks WHERE id = :id', { id });
    return result.affectedRows > 0;
  }

  // PUBLIC_INTERFACE
  static async markComplete(id, complete = true) {
    /** Toggle completion state for a task. */
    const pool = await getPool();
    const [result] = await pool.query(
      'UPDATE tasks SET is_completed = :state WHERE id = :id',
      { id, state: complete ? 1 : 0 }
    );
    if (result.affectedRows === 0) return null;
    return this.getById(id);
  }
}

module.exports = TaskModel;
