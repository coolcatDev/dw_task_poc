import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const STATUS_DISPLAY_DURATION = 2000; // 2 seconds

export const useTaskApi = () => {

    // Task List State
    const [tasks, setTasks] = useState([]);
    const [listStatus, setListStatus] = useState('ready'); // processing, success, error, ready
    const [listError, setListError] = useState(null);

    // API Call Wrapper
    const apiCall = useCallback(async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
            
            if (!response.ok) {
                let errorMessage = `API Error: ${response.status} ${response.statusText}`;
                try {
                    const errorBody = await response.json();
                    if (errorBody.detail) {
                        errorMessage = errorBody.detail;
                    }
                } catch (e) {}
                throw new Error(errorMessage);
            }

            if (response.status === 204) {
                return null;
            }

            const data = await response.json();
            return data;

        } catch (err) {
            console.error('API Call Failed:', err.message);
            throw err;
        }
    }, []);

    // API Calls
    const fetchTasks = useCallback(async () => {
        setListStatus('processing');
        setListError(null);
        let statusToSet = 'ready'; // Default status

        try {
            const data = await apiCall('/tasks/');
            if (data) setTasks(data);
            statusToSet = 'success';
        } catch (e) {
            setListError(e.message);
            statusToSet = 'error';
        }

        // Set the final transient status (success or error)
        setListStatus(statusToSet); 

        // CRITICAL: Set a timer to clear the status back to 'ready' after 3s
        // This makes the 'success' or 'error' message auto-hide.
        const timer = setTimeout(() => {
            setListStatus('ready');
        }, STATUS_DISPLAY_DURATION);
        
        // Return cleanup function to clear timer if component unmounts quickly
        return () => clearTimeout(timer); 

    }, [apiCall]);

    const addTask = useCallback((taskData) => apiCall('/tasks/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    }), [apiCall]);

    const updateTask = useCallback((taskId, taskData) => apiCall(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
    }), [apiCall]);

    const deleteTask = useCallback((taskId) => apiCall(`/tasks/${taskId}`, {
        method: 'DELETE',
    }), [apiCall]);


    return {
        tasks,
        listStatus,
        listError,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        setTasks
    };
};