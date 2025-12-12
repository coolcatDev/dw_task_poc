import React, { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete, onUpdate, fetchTasks }) => {  
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editTitleError, setEditTitleError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const startEdit = (e) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        try {
            await onDelete(task.id);
            fetchTasks();
        } catch (e) {
            throw e;
        } 
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!editTitle.trim()) {
            setEditTitleError(true);
            return;
        }
        setEditTitleError(false);
        
        if (editTitle === task.title && editDescription === task.description) {
            setIsEditing(false);
            return;
        }
        
        setIsSaving(true);
        try {
            await onUpdate(task.id, {
                ...task,
                title: editTitle.trim(),
                description: editDescription.trim()
            });
            fetchTasks();
            setIsEditing(false);    
        } catch (e) {
            throw e;
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async () => {
        try {
            await onToggle(task);
            fetchTasks();
        } catch (e) {
            throw e;
        } 
    };

    const isActionDisabled = isSaving;

    if (isEditing) {
        return (
            <li className="editing">
                <form onSubmit={handleEditSubmit} className="edit-form">
                    <div className="input-group">
                        <label htmlFor={`edit-title-${task.id}`} className={editTitleError ? 'error-label' : ''}>
                            Title {editTitleError && '(Required)'}
                        </label>
                        <input
                            id={`edit-title-${task.id}`}
                            type="text"
                            value={editTitle}
                            onChange={(e) => {
                                setEditTitle(e.target.value);
                                setEditTitleError(false);
                            }}
                            className={editTitleError ? 'input-error-stroke' : ''}
                            disabled={isSaving}
                        />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor={`edit-desc-${task.id}`}>Description</label>
                        <textarea
                            id={`edit-desc-${task.id}`}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            rows="2"
                            disabled={isSaving}
                        />
                    </div>
                    
                    <div className="edit-actions">
                        <button type="submit" disabled={isSaving || editTitleError}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving}>
                            Cancel
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li key={task.id} className={task.is_done ? 'done' : ''}>
            <div className="task-content" onClick={isActionDisabled ? undefined : handleToggle}>
                <span className="task-title">{task.title}</span>
                {task.description && <span className="task-description">{task.description}</span>}
            </div>
            <div className="task-actions">
                <button onClick={startEdit} className="edit-btn" disabled={isActionDisabled}>Edit</button>
                <button 
                    onClick={handleDelete}  
                    className="delete-btn"  
                    disabled={isActionDisabled}
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default TaskItem;