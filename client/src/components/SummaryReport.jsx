// client/src/components/SummaryReport.jsx
import React from 'react';

const SummaryReport = ({ summaryReport, onGetSummary, isProcessing, status, error }) => {
    
    // Check if we have valid, structured report data
    const hasReport = summaryReport && summaryReport.count !== undefined;

    // Helper component to render markdown-like text (simple line breaks and bolding)
    const renderSummaryText = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => (
            <p key={index} style={{ marginBottom: '0.5em', whiteSpace: 'pre-wrap' }}>
                {line}
            </p>
        ));
    };

    return (
        <div className="summary-box">
            <h2 className="summary-title">
                AI Task Analysis
                <button 
                    onClick={onGetSummary} 
                    disabled={isProcessing}
                    className="summary-button"
                >
                    {isProcessing ? 'Analyzing...' : 'Get Summary'}
                </button>
            </h2>

            {/* --- Status/Error Feedback --- */}
            {isProcessing && (
                <p className="summary-status processing">Generating report...</p>
            )}
            {status === 'error' && error && (
                <p className="summary-status error">Error: {error}</p>
            )}

            {/* --- Report Content --- */}
            {hasReport ? (
                <div className="summary-content">
                    
                    {/* 1. Quantitative Data */}
                    <div className="summary-stats">
                        <span className="stat-item">
                            Total Tasks: <strong>{summaryReport.count}</strong>
                        </span>
                        <span className="stat-item done">
                            Done: <strong>{summaryReport.done_count}</strong>
                        </span>
                        <span className="stat-item pending">
                            Pending: <strong>{summaryReport.pending_count}</strong>
                        </span>
                    </div>

                    <hr />

                    {/* 2. Descriptive Analysis (LLM Output) */}
                    <div className="summary-description">
                        <h3>Pending Analysis</h3>
                        {renderSummaryText(summaryReport.description_pending)}
                        
                        <h3>Completed Analysis</h3>
                        {renderSummaryText(summaryReport.description_done)}
                    </div>
                    
                    {/* 3. Priority Suggestions */}
                    {summaryReport.suggested_order_of_priority && summaryReport.suggested_order_of_priority.length > 0 && (
                        <>
                            <hr />
                            <h3>Suggested Priority</h3>
                            <ol className="priority-list">
                                {summaryReport.suggested_order_of_priority.map((taskTitle, index) => (
                                    <li key={index}>{taskTitle}</li>
                                ))}
                            </ol>
                        </>
                    )}
                </div>
            ) : (
                <p className="initial-message">Click "Get Summary" to analyze your task list with the AI assistant.</p>
            )}
        </div>
    );
};

export default SummaryReport;