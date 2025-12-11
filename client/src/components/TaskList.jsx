import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, listStatus, listError, toggleTask, handleDeleteTask, handleUpdateTask, fetchTasks }) => {
    
    const pendingTasks = tasks.filter(t => !t.is_done).length;

    // Helper to get the display message
    const getStatusMessage = () => {
        switch (listStatus) {
            case 'processing':
                return 'Processing';
            case 'success':
                return 'Ready';
            case 'error':
                // Can Use listError for detail, but show a user-friendly failure message
                // return `Connection failed: ${listError || 'Please try again'}`;
                return 'Failed';  
            default:
                return null;
        }
    };

    // Render List Data and Status 
    const statusMessage = getStatusMessage();

    return (
        <div className="task-list">
            <h2>Your Tasks ({pendingTasks} Pending)</h2>
            
            {/* Dynamic Status Display (Appears briefly, then auto-hides) */}
            {statusMessage && listStatus !== 'ready' && (
                <div className={`status ${listStatus}`}>
                    {statusMessage}
                </div>
            )}
            
            <ul>
                {tasks.map(task => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={handleDeleteTask}
                        onUpdate={handleUpdateTask}
                        fetchTasks={fetchTasks} 
                    />
                ))}
            </ul>
        </div>
    );
};

export default TaskList;