import React, { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const [files, setFiles] = useState([]);

    const addFile = (newFile) => {
        setFiles((prevFiles) => [...prevFiles, newFile]);
    };

    // Define the updateFile function
    const updateFile = (fileId, updatedProperties) => {
        setFiles((currentFiles) =>
            currentFiles.map((file) =>
                file.fileId === fileId ? { ...file, ...updatedProperties } : file
            )
        );
    };

    return (
        <FileContext.Provider value={{ files, addFile, updateFile }}>
            {children}
        </FileContext.Provider>
    );
};

// Custom hook to use the file context
export const useFiles = () => useContext(FileContext);

