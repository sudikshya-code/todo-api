import { useEffect, useState } from "react";

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");

      if (editingTask.dueDate) {
        setDueDate(
          new Date(editingTask.dueDate)
            .toISOString()
            .split("T")[0]
        );
      } else {
        setDueDate("");
      }
    } else {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || undefined,
    });

    if (!editingTask) {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>
        {editingTask ? "Edit Task" : "Add New Task"}
      </h2>

      <div className="form-group">
        <label>Title</label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          maxLength="100"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Due Date</label>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-buttons">
        <button type="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;