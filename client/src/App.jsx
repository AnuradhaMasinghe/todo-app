import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://localhost:3001/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editTodo, setEditTodo] = useState({ title: '', description: '' });
  const [formError, setFormError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError('Unable to load tasks right now. Please refresh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, []);

  const showStatus = (message) => {
    setStatus(message);
    setTimeout(() => setStatus(''), 3200);
  };

  const validateNewTodo = () => {
    if (!newTodo.title.trim()) {
      setFormError('A title is required to save a task.');
      return false;
    }
    setFormError('');
    return true;
  };

  const createTodo = async (e) => {
    e.preventDefault();
    if (!validateNewTodo()) return;

    const optimisticTodo = {
      _id: `pending-${Date.now()}`,
      title: newTodo.title.trim(),
      description: newTodo.description.trim(),
      done: false,
      pending: true
    };

    setTodos((prev) => [...prev, optimisticTodo]);
    setNewTodo({ title: '', description: '' });
    setFormError('');

    try {
      const response = await axios.post(API_BASE_URL, optimisticTodo);
      setTodos((prev) => prev.map((todo) => todo._id === optimisticTodo._id ? response.data : todo));
      showStatus('Task added successfully!');
    } catch (err) {
      setTodos((prev) => prev.filter((todo) => todo._id !== optimisticTodo._id));
      setError('Unable to add task. Please try again.');
      console.error(err);
    }
  };

  const updateTodo = async (e) => {
    e.preventDefault();
    if (!editTodo.title.trim()) {
      setFormError('Please enter a title before saving.');
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/${editingId}`, editTodo);
      setTodos((prev) => prev.map((todo) => todo._id === editingId ? response.data : todo));
      setEditingId(null);
      setEditTodo({ title: '', description: '' });
      setFormError('');
      showStatus('Task updated!');
    } catch (err) {
      setError('Update failed. Please try again.');
      console.error(err);
    }
  };

  const toggleDone = async (id) => {
    const previous = todos;
    setTodos((prev) => prev.map((todo) => todo._id === id ? { ...todo, done: !todo.done } : todo));

    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/done`);
      setTodos((prev) => prev.map((todo) => todo._id === id ? response.data : todo));
      showStatus('Task status updated.');
    } catch (err) {
      setTodos(previous);
      setError('Failed to update status.');
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    const backup = todos;
    setTodos((prev) => prev.filter((todo) => todo._id !== id));

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      showStatus('Task removed.');
    } catch (err) {
      setTodos(backup);
      setError('Could not delete the task.');
      console.error(err);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTodo({ title: todo.title, description: todo.description || '' });
    setFormError('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTodo({ title: '', description: '' });
    setFormError('');
  };

  return (
    <div className="app">
      <div className="hero-panel">
        <div className="hero-badge">TODO APP</div>
       
        <p>Organize tasks with a calm and friendly experience.</p>
      </div>

      {(status || error) && (
        <div className={`toast ${error ? 'toast-error' : 'toast-success'}`}>
          {error || status}
        </div>
      )}

      <form onSubmit={createTodo} className="todo-form">
        <div className="input-row">
          <label>
            Title
            <input
              type="text"
              placeholder="What do you want to accomplish today?"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            />
          </label>
          <label>
            Description
            <input
              type="text"
              placeholder="Optional details..."
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            />
          </label>
        </div>
        {formError && <div className="field-error">{formError}</div>}
        <button type="submit" className="primary-button">Add Task</button>
      </form>

      {loading ? (
        <div className="loading">Loading your tasks...</div>
      ) : (
        <div className="todos">
          {todos.length === 0 ? (
            <div className="empty-state">No tasks yet — add something bright to your day.</div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className={`todo ${todo.done ? 'done' : ''}`}>
                {editingId === todo._id ? (
                  <form onSubmit={updateTodo} className="edit-form">
                    <input
                      type="text"
                      value={editTodo.title}
                      onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                      placeholder="Updated title"
                    />
                    <input
                      type="text"
                      value={editTodo.description}
                      onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                      placeholder="Updated description"
                    />
                    <div className="button-group">
                      <button type="submit" className="primary-button small">Save</button>
                      <button type="button" className="secondary-button small" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="todo-content">
                      <div className="todo-title-row">
                        <h3>{todo.title}</h3>
                        <span className="todo-chip">{todo.done ? 'Done' : 'Open'}</span>
                      </div>
                      {todo.description && <p>{todo.description}</p>}
                    </div>
                    <div className="todo-actions">
                      <button className="toggle-button" onClick={() => toggleDone(todo._id)}>
                        {todo.done ? 'Undo' : 'Complete'}
                      </button>
                      <button className="edit-button" onClick={() => startEdit(todo)}>Edit</button>
                      <button className="delete-button" onClick={() => deleteTodo(todo._id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
