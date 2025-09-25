'use strict';
/**
 * Controller for Task endpoints.
 */
const TaskService = require('../services/taskService');

function parseId(param) {
  const id = Number(param);
  return Number.isFinite(id) && id > 0 ? id : null;
}

class TasksController {
  // PUBLIC_INTERFACE
  async list(req, res) {
    /** List all tasks with optional search. */
    try {
      const tasks = await TaskService.list(req.query);
      return res.status(200).json({ status: 'ok', data: tasks });
    } catch (err) {
      console.error('List tasks error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to list tasks' });
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res) {
    /** Get single task by id. */
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'Invalid task id' });
      const task = await TaskService.get(id);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'ok', data: task });
    } catch (err) {
      console.error('Get task error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to retrieve task' });
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res) {
    /** Create a task. */
    try {
      const task = await TaskService.create(req.body);
      return res.status(201).json({ status: 'ok', data: task });
    } catch (err) {
      if (err?.issues) {
        return res.status(400).json({ status: 'error', message: 'Validation failed', details: err.issues });
      }
      console.error('Create task error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to create task' });
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res) {
    /** Update a task. */
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'Invalid task id' });

      const task = await TaskService.update(id, req.body);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'ok', data: task });
    } catch (err) {
      if (err?.issues) {
        return res.status(400).json({ status: 'error', message: 'Validation failed', details: err.issues });
      }
      console.error('Update task error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to update task' });
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res) {
    /** Delete a task. */
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'Invalid task id' });

      const result = await TaskService.remove(id);
      if (result === null) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'ok', message: 'Task deleted' });
    } catch (err) {
      console.error('Delete task error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to delete task' });
    }
  }

  // PUBLIC_INTERFACE
  async complete(req, res) {
    /** Mark a task as completed. */
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'Invalid task id' });
      const task = await TaskService.markComplete(id, true);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'ok', data: task });
    } catch (err) {
      console.error('Complete task error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to complete task' });
    }
  }

  // PUBLIC_INTERFACE
  async uncomplete(req, res) {
    /** Mark a task as not completed. */
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ status: 'error', message: 'Invalid task id' });
      const task = await TaskService.markComplete(id, false);
      if (!task) return res.status(404).json({ status: 'error', message: 'Task not found' });
      return res.status(200).json({ status: 'ok', data: task });
    } catch (err) {
      console.error('Uncomplete task error:', err);
      return res.status(500).json({ status: 'error', message: 'Failed to uncomplete task' });
    }
  }
}

module.exports = new TasksController();
