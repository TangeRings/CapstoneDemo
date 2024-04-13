import React, { useState } from 'react';
import { uploadFileToServer } from './Uploader';
import { getSpreadsheetData } from './getList';

const StudentRow = ({ student }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [spreadsheetData, setSpreadsheetData] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    // Handles file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Function to handle the file upload process
    const handleUpload = () => {
        if (!selectedFile) {
            alert('Please select a file to upload first.');
            return;
        }

        setIsUploading(true); // Set the uploading state to true
        
        uploadFileToServer(selectedFile, student.id)
            .then(() => {
                alert('File uploaded successfully');
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                alert('Failed to upload file.');
            })
            .finally(() => {
                setIsUploading(false); // Set the uploading state to false
            });
    };

    // Function to fetch spreadsheet data
    const fetchSpreadsheetData = async () => {
        try {
            const data = await getSpreadsheetData();
            setSpreadsheetData(data);
        } catch (error) {
            // Handle the error appropriately
            console.error("Error fetching data:", error);
            alert('Failed to fetch data.');
        }
    };

    // Handles clicking the upload button
    const handleUploadClick = () => {
        handleUpload(); // Start the upload process
    };

    // Handles clicking the refresh button
    const handleRefreshClick = () => {
        fetchSpreadsheetData(); // Fetch data on demand
    };

    return (
        <>
            <tr>
                <td>{student.name}</td>
                <td>
                    <input type="file" onChange={handleFileChange} disabled={isUploading} />
                    <button onClick={handleUploadClick} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                    <button onClick={handleRefreshClick} disabled={isUploading}>
                        Refresh Data
                    </button>
                </td>
            </tr>
            {/* Data display logic */}
            {spreadsheetData && spreadsheetData.length > 0 && (
                <div>
                    <h3>Uploaded Files</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Filename</th>
                                <th>Upload Date</th>
                                <th>File Format</th>
                                <th>Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spreadsheetData.map((row, index) => (
                                <tr key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export default StudentRow;




