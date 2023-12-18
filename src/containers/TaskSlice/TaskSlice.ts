import { createSlice } from '@reduxjs/toolkit';
import {addTask, deleteTask, fetchTasks, toggleTaskStatus} from './TaskThunks';

interface Task {
  id: string;
  title: string;
  status: boolean;
}

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to fetch tasks';
    });

    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.tasks.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to add task';
    });

    builder.addCase(toggleTaskStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(toggleTaskStatus.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
      state.loading = false;
    });
    builder.addCase(toggleTaskStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to toggle task status';
    });

    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to delete task';
    });
  },
});

export default tasksSlice.reducer;