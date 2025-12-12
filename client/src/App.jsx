import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { Toaster } from 'react-hot-toast';
import { useTaskApi } from './api/useTaskApi';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SummaryReport from './components/SummaryReport';

function App() {
    // API Data Service
    const { 
        tasks, 
        fetchTasks, 
        addTask, 
        updateTask, 
        deleteTask, 
        getSummary,
    } = useTaskApi();

    const [summaryReport, setSummaryReport] = useState(null);
    const [isSummaryProcessing, setIsSummaryProcessing] = useState(false);

    // Fetch Data on Mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); 

    // Task Handlers
    const toggleTask = useCallback(async (task) => {
        await updateTask(task.id, { ...task, is_done: !task.is_done });
        fetchTasks();
    }, [updateTask, fetchTasks]);

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

    const handleGetSummary = useCallback(async () => {
        setIsSummaryProcessing(true);
        setSummaryReport(null);

        try {
            const data = await getSummary(); 
            setSummaryReport(data);
        } catch (e) {
            // Error is handled by the toast in useTaskApi.js
        } finally {
            setIsSummaryProcessing(false);       
        }
    }, [getSummary]);

    // Render App Components
    return (
        <div className="App">
            <Toaster position="top-right" /> {/* Global Toast Container */}
            <h1>Task Manager</h1>

            <TaskForm onAddTask={handleAddTask} />

            <TaskList 
                tasks={tasks.slice().sort((a, b) => b.id - a.id)} 
                fetchTasks={fetchTasks}
                toggleTask={toggleTask}
                handleDeleteTask={handleDeleteTask}
                handleUpdateTask={handleUpdateTask}
            />

            <SummaryReport
                summaryReport={summaryReport}
                onGetSummary={handleGetSummary}
                isProcessing={isSummaryProcessing} // Now uses the simplified boolean state
            />
        </div>
    );
}

export default App;