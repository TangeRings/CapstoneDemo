// getList.js
import axios from 'axios';

// Function to fetch data from the spreadsheet and sort it by date in descending ordered
export const getSpreadsheetData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/getlist');
        // Sort the data in descending order by date
        // Assuming that the date is at index 1
        const sortedData = response.data.sort((a, b) => {
            // Convert the date strings to date objects for comparison
            return new Date(b[1]) - new Date(a[1]);
        });
        return sortedData;
    } catch (error) {
        console.error("Error fetching spreadsheet data:", error);
        throw error; // Re-throw the error to be handled by the calling code
    }
};
