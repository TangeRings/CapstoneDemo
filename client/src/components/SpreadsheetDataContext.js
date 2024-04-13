import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Creating the context
const SpreadsheetDataContext = createContext();

// Custom hook for using context
export const useSpreadsheetData = () => useContext(SpreadsheetDataContext);

// Function to fetch data from the spreadsheet
export const fetchDataWithPolling = async (setData, attempts = 5, interval = 5000) => {
    for (let i = 0; i < attempts; i++) {
        try {
            const response = await axios.get('http://localhost:5000/getlist');
            const sortedData = response.data.sort((a, b) => new Date(b[1]) - new Date(a[1]));
            if (sortedData && sortedData.length > 0) {
                setData(sortedData);
                return;
            }
            // Delay for interval if no data or incomplete data
            await new Promise(resolve => setTimeout(resolve, interval));
        } catch (error) {
            console.error("Error fetching spreadsheet data:", error);
            if (i === attempts - 1) throw error;
        }
    }
    throw new Error('Failed to fetch data after maximum retries.');
};

// Provider component
export const SpreadsheetDataProvider = ({ children }) => {
    const [data, setData] = useState([]);

    return (
        <SpreadsheetDataContext.Provider value={{ data, fetchData: () => fetchDataWithPolling(setData) }}>
            {children}
        </SpreadsheetDataContext.Provider>
    );
};
