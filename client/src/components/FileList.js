import React, { useState } from 'react';
import { useFiles } from '../components/FileContext'; // Adjust the import path as needed

const FileList = ({ studentId }) => {
    const { files, updateFile } = useFiles(); // Assuming you have an updateFile function in your context
    const studentFiles = files.filter(file => file.studentId === studentId);

    const handleSaveChanges = (fileId, fileName, fileDate) => {
        updateFile(fileId, { fileName, date: fileDate, isRecording: false });
    };

    return (
        <ul>
            {studentFiles.map((file) => (
                <li key={file.fileId}>
                    {file.isRecording ? (
                        <div>
                            <input
                                defaultValue={file.fileName}
                                onBlur={(e) => handleSaveChanges(file.fileId, e.target.value, file.date)}
                            />
                            <input
                                type="date"
                                defaultValue={file.date}
                                onBlur={(e) => handleSaveChanges(file.fileId, file.fileName, e.target.value)}
                            />
                            <button onClick={() => handleSaveChanges(file.fileId, file.fileName, file.date)}>Save</button>
                        </div>
                    ) : (
                        `${file.fileName} - ${file.date}`
                    )}
                </li>
            ))}
        </ul>
    );
};

export default FileList;









