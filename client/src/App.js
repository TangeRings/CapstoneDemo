import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SpreadsheetDataProvider } from './components/SpreadsheetDataContext';
import DashboardTable from './components/DashboardTable';
import GradingPage from './pages/GradingPage'; // Make sure to create this component
import MeetingPage from './pages/MeetingPage';  


function App() {
  return (
    <Router>
      <SpreadsheetDataProvider>
        <Switch>
          <Route path="/" exact component={DashboardTable} />
          <Route path="/grading/:fileId" component={GradingPage} />
          <Route path="/meeting/:meetingName" component={MeetingPage} />
        </Switch>
      </SpreadsheetDataProvider>
    </Router>
  );
}

export default App;






