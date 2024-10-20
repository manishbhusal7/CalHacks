// import React, { useEffect, useState } from 'react';

// function App() {
//   const [file, setFile] = useState(null);
//   const [summary, setSummary] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [uploadedFiles, setUploadedFiles] = useState([]); // State to store uploaded files

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     setLoading(true);
//     setSummary('');  // Clear previous summary

//     try {
//       const response = await fetch('http://127.0.0.1:5000/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch summary');
//       }

//       const data = await response.json();
//       setSummary(data.summary); // Set summary
//       fetchUploadedFiles(); // Fetch the updated list of uploaded files
//     } catch (error) {
//       console.error(error);
//       setSummary('Error fetching summary.'); // Provide a user-friendly message
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUploadedFiles = async () => {
//     try {
//       const response = await fetch('http://127.0.0.1:5000/files');
//       const data = await response.json();
//       setUploadedFiles(data.files); // Update the state with the list of files
//     } catch (error) {
//       console.error('Error fetching uploaded files:', error);
//     }
//   };

//   const handleFileClick = async (filename) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:5000/summary/${filename}`);
//       const data = await response.json();
//       if (data.summary) {
//         setSummary(data.summary); // Set summary from the clicked file
//       } else {
//         setSummary('Summary not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching summary:', error);
//       setSummary('Error fetching summary.');
//     }
//   };

//   const handleDeleteFile = async (filename) => {
//     if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
//       try {
//         const response = await fetch(`http://127.0.0.1:5000/delete/${filename}`, {
//           method: 'DELETE',
//         });

//         if (response.ok) {
//           fetchUploadedFiles(); // Refresh the list after deletion
//         } else {
//           console.error('Failed to delete file');
//         }
//       } catch (error) {
//         console.error('Error deleting file:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchUploadedFiles(); // Fetch uploaded files on initial load
//   }, []);

//   return (
//     <div style={{ display: 'flex', marginTop: '50px' }}>
//       <div style={{ flex: 1, marginRight: '20px' }}>
//         <h2>Uploaded Files</h2>
//         <ul>
//           {uploadedFiles.map((filename, index) => (
//             <li key={index} onClick={() => handleFileClick(filename)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
//               {filename}
//               <button onClick={() => handleDeleteFile(filename)} style={{ marginLeft: '10px', color: 'red' }}>
//                 Delete
//               </button> {/* Add delete button */}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div style={{ flex: 2 }}>
//         <h1>PDF Summarization</h1>
//         <form onSubmit={handleSubmit}>
//           <input type="file" accept=".pdf" onChange={handleFileChange} required />
//           <button type="submit" disabled={loading}>
//             {loading ? 'Summarizing...' : 'Upload and Summarize'}
//           </button>
//         </form>
//         {summary && (
//           <div>
//             <h2>Summary</h2>
//             <p>{summary}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store uploaded files

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setSummary('');  // Clear previous summary

    try {
      const response = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch summary');
      }

      const data = await response.json();
      setSummary(data.summary); // Set summary
      fetchUploadedFiles(); // Fetch the updated list of uploaded files
    } catch (error) {
      console.error(error);
      setSummary('Error fetching summary.'); // Provide a user-friendly message
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/files');
      const data = await response.json();
      setUploadedFiles(data.files); // Update the state with the list of files
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
    }
  };

  const handleFileClick = async (filename) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/summary/${filename}`);
      const data = await response.json();
      if (data.summary) {
        setSummary(data.summary); // Set summary from the clicked file
      } else {
        setSummary('Summary not found.');
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      setSummary('Error fetching summary.');
    }
  };

  const handleDeleteFile = async (filename) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/delete/${filename}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchUploadedFiles(); // Refresh the list after deletion
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  useEffect(() => {
    fetchUploadedFiles(); // Fetch uploaded files on initial load
  }, []);

  return (
    <div style={{ display: 'flex', marginTop: '50px' }}>
      <div style={{ flex: 1, marginRight: '20px' }}>
        <h2>Uploaded Files</h2>
        <ul>
          {uploadedFiles.map((filename, index) => (
            <li key={index} onClick={() => handleFileClick(filename)} style={{ cursor: 'pointer', marginBottom: '10px' }}>
              {filename}
              <button onClick={() => handleDeleteFile(filename)} style={{ marginLeft: '10px', color: 'red' }}>
                Delete
              </button> {/* Add delete button */}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 2 }}>
        <h1>File Summarization</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".pdf, .png, .jpg, .jpeg" onChange={handleFileChange} required />
          <button type="submit" disabled={loading}>
            {loading ? 'Summarizing...' : 'Upload and Summarize'}
          </button>
        </form>
        {summary && (
          <div>
            <h2>Summary</h2>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
