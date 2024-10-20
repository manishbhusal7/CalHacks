import axios from 'axios';
import React, { useState } from 'react';

function App() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please upload a PDF file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFileName(response.data.filename);
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error uploading the file:", error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>PDF Summarizer</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Summarize</button>

            {fileName && (
                <div>
                    <h3>Summary for: {fileName}</h3>
                    <p>{summary}</p>
                </div>
            )}
        </div>
    );
}

export default App;
