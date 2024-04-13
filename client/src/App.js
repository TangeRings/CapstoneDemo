import React from 'react';
import { SpreadsheetDataProvider } from './components/SpreadsheetDataContext';  // Adjust the path as necessary
import DashboardTable from './components/DashboardTable';  // Adjust the path as necessary

function App() {
    return (
        <SpreadsheetDataProvider>
            <DashboardTable />
        </SpreadsheetDataProvider>
    );
}

export default App;





