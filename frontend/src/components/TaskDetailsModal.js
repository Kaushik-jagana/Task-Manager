import React from 'react';
import '../styles/TaskDetailsModal.css';  

function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Task Details</h2>
        <p><strong>Title:</strong> {task.title}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Created at:</strong> {new Date(task.createdAt).toLocaleString()}</p>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
}

export default TaskDetailsModal;
