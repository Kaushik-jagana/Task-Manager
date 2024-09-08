const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Task title and description are required' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      userId: req.user.id,  
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { status, title, description } = req.body;
  
    try {
      let task = await Task.findById(req.params.id);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      if (task.userId.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized' });
      }
  
      task.status = status || task.status;
      task.title = title || task.title;
      task.description = description || task.description;
  
      
      await task.save();
      res.json(task);
    } catch (err) {
      console.error(err.message);  
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  });
  


router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
