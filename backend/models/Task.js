const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['TODO', 'INPROGRESS', 'DONE'], default: 'TODO' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Link task to the user
});

module.exports = mongoose.model('Task', TaskSchema);
