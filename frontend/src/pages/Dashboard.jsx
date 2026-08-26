import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import LoadingSkeleton from "../components/LoadingSkeleton";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!storedToken || !storedUser) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
    fetchTasks();
  }, [navigate]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tasks");
      setTasks(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Unable to load your tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      setError("");

      if (editingTask) {
        const response = await api.put(
          `/tasks/${editingTask._id}`,
          taskData
        );

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === editingTask._id
              ? response.data.data
              : task
          )
        );

        setEditingTask(null);
        setShowForm(false);
      } else {
        const response = await api.post("/tasks", taskData);

        setTasks((currentTasks) => [
          response.data.data,
          ...currentTasks,
        ]);

        setShowForm(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to save the task."
      );
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleToggleComplete = async (task) => {
    try {
      setError("");

      const response = await api.put(
        `/tasks/${task._id}`,
        {
          isCompleted: !task.isCompleted,
        }
      );

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === task._id
            ? response.data.data
            : currentTask
        )
      );
    } catch (error) {
      setError("Unable to update the task.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      setError("");

      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      setError("Unable to delete the task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  if (!user) {
    return <div className="page-loading">Loading...</div>;
  }

  const completedTasks = tasks.filter(
    (task) => task.isCompleted
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">✓</div>
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span>▦</span>
            Dashboard
          </div>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-mini">
            <div className="avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name}</strong>
              <small>Account</small>
            </div>
          </div>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        <header className="top-header">
          <div>
            <p className="eyebrow">WORKSPACE</p>
            <h1>My Tasks</h1>
            <p className="welcome-text">
              Stay organized and get things done.
            </p>
          </div>

          <button
            className="add-task-button"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <span>+</span>
            Add Task
          </button>
        </header>

        {/* ERROR */}
        {error && (
          <div className="error-notification">
            <span>!</span>
            {error}
          </div>
        )}

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div>
              <span className="stat-label">Total Tasks</span>
              <strong>{tasks.length}</strong>
            </div>

            <div className="stat-icon purple">
              ≡
            </div>
          </div>

          <div className="stat-card">
            <div>
              <span className="stat-label">Completed</span>
              <strong>{completedTasks}</strong>
            </div>

            <div className="stat-icon green">
              ✓
            </div>
          </div>

          <div className="stat-card">
            <div>
              <span className="stat-label">Pending</span>
              <strong>{pendingTasks}</strong>
            </div>

            <div className="stat-icon orange">
              ◷
            </div>
          </div>

        </section>

        {/* FORM */}
        {showForm && (
          <TaskForm
            onSubmit={handleSubmitTask}
            editingTask={editingTask}
            onCancel={handleCancelEdit}
          />
        )}

        {/* TASKS */}
        <section className="tasks-section">

          <div className="section-heading">
            <div>
              <h2>Tasks</h2>
              <p>Your current tasks and deadlines</p>
            </div>

            <span className="task-count">
              {tasks.length} tasks
            </span>
          </div>

          {loading ? (
            <LoadingSkeleton />
          ) : tasks.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No tasks yet</h3>
              <p>
                Create your first task and start
                organizing your work.
              </p>

              <button
                onClick={() => setShowForm(true)}
              >
                Create your first task
              </button>
            </div>

          ) : (

            <div className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                />
              ))}
            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;