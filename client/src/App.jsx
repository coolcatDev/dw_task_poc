import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import { useTaskApi } from './api/useTaskApi';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import SummaryReport from './components/SummaryReport';

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
        getSummary,
    } = useTaskApi();

    const [summaryReport, setSummaryReport] = useState(null);
    const [summaryStatus, setSummaryStatus] = useState('ready');
    const [summaryError, setSummaryError] = useState(null);

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

    const handleGetSummary = useCallback(async () => {
        setSummaryStatus('processing');
        setSummaryError(null);
        setSummaryReport(null); // Clear previous report
                
        try {
            const data = await getSummary(); 
            setSummaryReport(data); // Store the structured object
            setSummaryStatus('ready');        
        } catch (e) {
            setSummaryError("Could not retrieve AI summary.");
            setSummaryStatus('error');        
        }
    }, [getSummary]);

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

            <SummaryReport
                summaryReport={summaryReport}
                onGetSummary={handleGetSummary}
                isProcessing={summaryStatus === 'processing'}
                status={summaryStatus}
                error={summaryError}
            />
        </div>
    );
}

export default App;