import React, { useState } from 'react';
import { uploadFileToServer } from './Uploader';
import { getSpreadsheetData } from './getList';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';




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
            data.sort((a, b) => new Date(a[2]) - new Date(b[2]));
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
            <tr className="student-row">
                <td className="student-name">{student.name}</td>
                <td className="upload-column">
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
            
                
                <div className="uploaded-files-container">
                    
                    <table className="uploaded-files-table">
                        <thead>
                            <tr>
                                <th>Filename</th>
                                <th>Upload Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {spreadsheetData.map((row, index) => {
                                // Check the content of the row to determine if it's a meeting or file
                                const isMeeting = row[3] === 'meeting';
                                const baseUrl = isMeeting ? '/meeting/' : '/grading/';
                                const linkPath = `${baseUrl}${encodeURIComponent(row[5])}`;

                                return (
                                    <tr key={index}>
                                        <td>
                                            <Link to={linkPath}>
                                                {row[1]} {/* Make filename clickable */}
                                            </Link>
                                        </td>
                                        <td>{row[2]} {/* Display upload date */}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default StudentRow;