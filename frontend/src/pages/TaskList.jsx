import React, { useEffect, useState, useCallback } from "react";
import "../styles/TaskList.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", due_date: "" });
  const [sort, setSort] = useState("none"); // none, due_date, status
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, complete
  const [editingTask, setEditingTask] = useState(null);
  const token = localStorage.getItem("token");

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        });
        setEditingTask(null);
      } else {
        await fetch("http://localhost:5000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...form, status: "pending" }),
        });
      }

      setForm({ title: "", description: "", due_date: "" });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      due_date: task.due_date ? task.due_date.slice(0, 10) : "",
      status: task.status || "pending",
    });
  };

  const toggleStatus = async (task) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...task,
          status: task.status === "complete" ? "pending" : "complete",
        }),
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter, search, sort
  const filteredTasks = tasks
    .filter((task) => {
      if (filterStatus !== "all" && task.status !== filterStatus) return false;
      return (
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      if (sort === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (sort === "status") {
        if (a.status === b.status) return 0;
        if (a.status === "pending") return -1;
        return 1;
      }
      return 0;
    });

  return (
    <div className="task-page">
      <div className="task-header">
        <h1>Task Manager</h1>
        <p className="sub-text">
          "Your day is a blank page, make it a masterpiece."
        </p>
        <p className="quote">
          “Success is the sum of small efforts, repeated day in and day out.”
        </p>
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          value={form.due_date}
          onChange={(e) => setForm({ ...form, due_date: e.target.value })}
        />
        <button type="submit">{editingTask ? "Update Task" : "+ Add Task"}</button>
        {editingTask && (
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setForm({ title: "", description: "", due_date: "" });
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="task-controls">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="complete">Complete</option>
        </select>
        <select onChange={(e) => setSort(e.target.value)} value={sort}>
          <option value="none">Sort</option>
          <option value="due_date">Due Date</option>
          <option value="status">Status</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="empty">No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${task.status === "complete" ? "complete" : ""}`}
            >
              <div className="task-top">
                <h3>{task.title}</h3>
                <span className="due">{task.due_date ? task.due_date.slice(0, 10) : "No date"}</span>
              </div>
              {task.description && <p className="desc">{task.description}</p>}
              <div className="task-actions">
                <button onClick={() => toggleStatus(task)}>
                  Mark {task.status === "complete" ? "Pending" : "Complete"}
                </button>
                <button onClick={() => handleEdit(task)}>Edit</button>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
