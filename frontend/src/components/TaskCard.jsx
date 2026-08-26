function TaskCard({ task, onEdit, onToggleComplete, onDelete }) {
  return (
    <div className={`task-card ${task.isCompleted ? "completed" : ""}`}>
      <div className="task-content">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}

        {task.dueDate && (
          <p className="due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        )}

        <p className="status">
          Status:{" "}
          {task.isCompleted ? "Completed" : "Incomplete"}
        </p>
      </div>

      <div className="task-actions">
        <button onClick={() => onToggleComplete(task)}>
          {task.isCompleted ? "Mark Incomplete" : "Complete"}
        </button>

        <button onClick={() => onEdit(task)}>
          Edit
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;