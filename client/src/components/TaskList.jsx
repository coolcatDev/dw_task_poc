import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, toggleTask, handleDeleteTask, handleUpdateTask, fetchTasks }) => {
    
    const pendingTasks = tasks.filter(t => !t.is_done).length;

    return (
        <div className="task-list">
            <h2>Your Tasks ({pendingTasks} Pending)</h2>
                        
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