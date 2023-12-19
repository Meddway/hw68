import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosApi from "../../axiosApi";
import {AppDispatch, RootState} from "../../app/store";

interface Task {
  id: string;
  title: string;
  status: boolean;
}

type AsyncThunkConfig = {
  state: RootState;
  rejectValue: string;
  dispatch: AppDispatch;
};

export const fetchTasks = createAsyncThunk<Task[], void, AsyncThunkConfig>(
  'tasks/fetchTasks',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axiosApi.get<{ [key: string]: Task }>('/tasks.json');
      const tasksArray = Object.entries(response.data || {}).map(([id, task]) => ({
        id,
        title: task.title,
        status: task.status,
      }));
      return tasksArray || [];
    } catch (error) {
      return rejectWithValue('Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk<Task, string, AsyncThunkConfig>(
  'tasks/addTask',
  async (title, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post<Task>('/tasks.json', {title, status: false});
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to add task');
    }
  }
);

export const toggleTaskStatus = createAsyncThunk<Task, string, AsyncThunkConfig>(
  'tasks/toggleTaskStatus',
  async (id, {rejectWithValue, getState}) => {
    const {tasks} = getState().tasks;
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return rejectWithValue('Task not found');
    }

    try {
      const response = await axiosApi.put<Task>(`/tasks/${id}.json`, {
        ...task,
        status: !task.status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to toggle task status');
    }
  }
);

export const deleteTask = createAsyncThunk<void, string, AsyncThunkConfig>(
  'tasks/deleteTask',
  async (id, {rejectWithValue, dispatch}) => {
    try {
      await axiosApi.delete(`/tasks/${id}.json`);
      await dispatch(fetchTasks());
    } catch (error) {
      return rejectWithValue('Failed to delete task');
    }
  }
);