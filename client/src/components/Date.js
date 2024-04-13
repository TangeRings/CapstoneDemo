// Date.js
import React from 'react';

const DateDisplay = ({ submissions }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {submissions.map((submission, index) => (
        <span key={index}>
          {submission.submittedOn.toLocaleDateString()}
        </span>
      ))}
    </div>
  );
};

export default DateDisplay;

