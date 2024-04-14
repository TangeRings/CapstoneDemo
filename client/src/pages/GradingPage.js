import React from 'react';
import { useParams } from 'react-router-dom';

const GradingPage = () => {
  // Retrieve the `fileId` parameter from the URL
  const { fileId } = useParams();

  // Here, you could use `fileId` to fetch more data about the file if needed
  // For example, fetch file details from an API or construct a URL to display the file

  // Simple UI to indicate the file ID and display it
  return (
    <div>
      <h1>Grading Page</h1>
      <p>Currently viewing file with ID: {fileId}</p>
      {/* If you have a URL to embed the file, you can use an iframe or other elements to display it */}
      {/* This is just an example URL, you need to replace it with your actual file URL */}
      <iframe
        title="file-preview"
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        width="100%"
        height="480"
        allowFullScreen
      ></iframe>
      {/* Add more UI components as needed for grading functionality */}
    </div>
  );
};

export default GradingPage;
