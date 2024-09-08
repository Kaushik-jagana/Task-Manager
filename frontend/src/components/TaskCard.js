import React from 'react';
import '../styles/TaskCard.css';

function TaskCard({ provided, task }) {
  return (
    <div
      className="task-card"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <div className="task-card-actions">
        <button>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
}

export default TaskCard;
