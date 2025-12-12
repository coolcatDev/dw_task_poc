import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useTaskApi = () => {

    const [tasks, setTasks] = useState([]);

    const apiCall = useCallback(async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

            if (!response.ok) {
                let errorMessage = 'An unexpected error occurred!';
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody.detail || errorMessage;
                } catch (e) {
                    errorMessage = `API Error: ${response.status} ${response.statusText}`;
                }
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }

            if (response.status === 204) {
                return null;
            }

            const data = await response.json();
            return data;

        } catch (err) {
            console.error('API Call Failed:', err.message);
            if (err.message.includes('fetch')) {
                toast.error('Check network connection!');
            }
            throw err;
        }
    }, []);

    const fetchTasks = useCallback(async () => {
        try {
            const data = await apiCall('/tasks/');
            if (data) setTasks(data);
        } catch (e) {
            setTasks([]);
        }
    }, [apiCall]);

    const addTask = useCallback(async (taskData) => {
        try {
            const data = await apiCall('/tasks/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            toast.success('Task added successfully!');
            return data;
        } catch (e) {
            throw e;
        }
    }, [apiCall]);

    const updateTask = useCallback(async (taskId, taskData) => {
        try {
            const data = await apiCall(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            toast.success('Task updated successfully!');
            
            return data;
        } catch (e) {
            throw e;
        }
    }, [apiCall]);

    const deleteTask = useCallback(async (taskId) => {
        try {
            const data = await apiCall(`/tasks/${taskId}`, {
                method: 'DELETE',
            });
            toast.success('Task deleted successfully!');
            return data;
        } catch (e) {
            throw e;
        }
    }, [apiCall]);

    const getSummary = useCallback(async () => {
        const loadingToastId = toast.loading('Generating AI summary!');
        try {
            const data = await apiCall('/llm/summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            toast.success('AI summary generated!', { id: loadingToastId });
            return data;
        } catch (e) {
            toast.error('Failed to get AI summary!', { id: loadingToastId });
            throw e;
        }
    }, [apiCall]);

    return {
        tasks,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        setTasks,
        getSummary
    };
};