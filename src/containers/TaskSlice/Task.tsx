import React from 'react';
import {AppDispatch, RootState} from "../../app/store";
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {addTask, deleteTask, fetchTasks, toggleTaskStatus} from "./TaskThunks";

const Task: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks || []);
  const loading = useSelector((state: RootState) => state.tasks.loading);
  const error = useSelector((state: RootState) => state.tasks.error);

  const [newTaskTitle, setNewTaskTitle] = useState<string>('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      dispatch(addTask(newTaskTitle.trim()));
      setNewTaskTitle('');
    }
  };

  const handleToggleTaskStatus = (id: string) => {
    dispatch(toggleTaskStatus(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };


  return (
    <>
      <h1>TodoTaskList</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.status}
              onChange={() => handleToggleTaskStatus(task.id)}
            />
            {task.title}{' '}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Enter task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </>
  );
};

export default Task;