'use strict';
const express = require('express');
const tasksController = require('../controllers/tasks');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: To-do task management
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List all tasks
 *     description: Returns a list of tasks. Optional search by title using query param q.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Simple title search
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', tasksController.list.bind(tasksController));

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */
router.get('/:id', tasksController.get.bind(tasksController));

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Validation failed
 */
router.post('/', tasksController.create.bind(tasksController));

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task updated
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Task not found
 */
router.put('/:id', tasksController.update.bind(tasksController));

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete('/:id', tasksController.remove.bind(tasksController));

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   post:
 *     tags: [Tasks]
 *     summary: Mark task as complete
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task marked complete
 *       404:
 *         description: Task not found
 */
router.post('/:id/complete', tasksController.complete.bind(tasksController));

/**
 * @swagger
 * /api/tasks/{id}/uncomplete:
 *   post:
 *     tags: [Tasks]
 *     summary: Mark task as not complete
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task marked not complete
 *       404:
 *         description: Task not found
 */
router.post('/:id/uncomplete', tasksController.uncomplete.bind(tasksController));

module.exports = router;
