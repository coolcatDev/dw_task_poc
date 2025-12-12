import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {   
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);    

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if (!title.trim()) {
            setTitleError(true);
            return;
        }
        setTitleError(false);

        setIsProcessing(true);  
        try {
            await onAddTask({
                title: title.trim(),
                description: description.trim(),
                is_done: false,
            });

            setTitle('');
            setDescription('');
        } catch (e) {
            throw e; 
        } finally {
            setIsProcessing(false); 
        }
    };

    return (
        <div className="task-input">
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="task-title" className={titleError ? 'error-label' : ''}>
                        Task Title {titleError && '(Required)'}
                    </label>
                    <input
                        id="task-title"
                        type="text"
                        placeholder="e.g., Submit taxes (Required)"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setTitleError(false);
                        }}
                        className={titleError ? 'input-error-stroke' : ''}
                        disabled={isProcessing}
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="task-description">Description (Optional)</label>
                    <textarea
                        id="task-description"
                        placeholder="e.g., Gather all Q1 receipts and file by Monday."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="2"
                        disabled={isProcessing}
                    />
                </div>
                                
                <button type="submit" disabled={isProcessing || titleError}>
                    {isProcessing ? 'Adding Task...' : 'Add Task'}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;