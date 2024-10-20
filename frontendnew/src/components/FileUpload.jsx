// src/FileUpload.js
import React, { useState } from 'react';
import { geminiGetSummary } from '../api';

const FileUpload = ({prevMessages, addMessage, speakAudio}) => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState(''); // New state for error handling
    const [loading, setLoading] = useState(false); // New state for loading indication

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(''); // Reset error on file change
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select a file before submitting.'); // Check if file is selected
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true); // Set loading to true

        try {
            const data = await geminiGetSummary(formData);
            setSummary(data.summary);
            setError(''); // Reset error if request was successful
            addMessage([...prevMessages, { role: 'assistant', content: data.summary }]);
            speakAudio(data.summary);
        } catch (err) {
            setError(err.message); // Set error state on failure
            setSummary(''); // Clear summary if there's an error
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="container">
            <h2>Upload PDF for Summarization</h2>
            <form onSubmit={handleSubmit}>
                <input type="file" accept=".pdf" onChange={handleFileChange} />
                <button type="submit" disabled={loading}>Submit</button> {/* Disable button while loading */}
            </form>
            {loading && <p>Loading...</p>} {/* Display loading indicator */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
            {summary && (
                <div>
                    <h3>Summary:</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
