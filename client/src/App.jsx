import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useTaskApi } from './api/useTaskApi';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

function App() {
    // API Data Service
    const { 
        tasks, 
        listStatus, 
        listError, 
        fetchTasks, 
        addTask, 
        updateTask, 
        deleteTask, 
    } = useTaskApi();

    // Fetch Data on Mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); 


    // Task Handlers
    const toggleTask = useCallback(async (task) => {
        await updateTask(task.id, { ...task, is_done: !task.is_done });
    }, [updateTask]);

    const handleAddTask = useCallback(async (taskData) => {
        await addTask(taskData);
        fetchTasks();
    }, [addTask, fetchTasks]);

    const handleDeleteTask = useCallback(async (taskId) => {
        await deleteTask(taskId);
        fetchTasks();
    }, [deleteTask, fetchTasks]);

    const handleUpdateTask = useCallback(async (taskId, taskData) => {
        await updateTask(taskId, taskData);
        fetchTasks();
    }, [updateTask, fetchTasks]);

    // Render App Components
    return (
        <div className="App">
            <h1>Task Manager</h1>
            
            <TaskForm onAddTask={handleAddTask} />

            <TaskList 
                tasks={tasks.slice().sort((a, b) => b.id - a.id)} 
                listStatus={listStatus} 
                listError={listError}
                fetchTasks={fetchTasks}
                toggleTask={toggleTask}
                handleDeleteTask={handleDeleteTask}
                handleUpdateTask={handleUpdateTask}
            />
        </div>
    );
}

export default App;