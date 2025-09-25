'use strict';
/**
 * Business logic and validation for Tasks.
 */
const { z } = require('zod');
const TaskModel = require('../models/taskModel');

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(5000, 'Description too long').optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional().nullable(),
  isCompleted: z.boolean().optional(),
});

class TaskService {
  // PUBLIC_INTERFACE
  static async list(query) {
    /** List tasks, optional search query. */
    const q = query?.q ? String(query.q).trim() : undefined;
    return TaskModel.list({ q });
  }

  // PUBLIC_INTERFACE
  static async create(payload) {
    /** Validate and create a task. */
    const data = createTaskSchema.parse(payload);
    return TaskModel.create(data);
  }

  // PUBLIC_INTERFACE
  static async update(id, payload) {
    /** Validate and update a task. */
    const data = updateTaskSchema.parse(payload || {});
    const existing = await TaskModel.getById(id);
    if (!existing) return null;
    return TaskModel.update(id, data);
  }

  // PUBLIC_INTERFACE
  static async remove(id) {
    /** Remove a task, returning true if removed. */
    const existing = await TaskModel.getById(id);
    if (!existing) return null;
    return TaskModel.remove(id);
  }

  // PUBLIC_INTERFACE
  static async markComplete(id, complete = true) {
    /** Mark a task completed or not. */
    const existing = await TaskModel.getById(id);
    if (!existing) return null;
    return TaskModel.markComplete(id, complete);
  }

  // PUBLIC_INTERFACE
  static async get(id) {
    /** Get a single task. */
    return TaskModel.getById(id);
  }
}

module.exports = TaskService;
