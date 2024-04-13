// DashboardTable.js
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ActionBar from './client/src/components/ActionBar'; // Make sure this import path is correct
import { getFileIcon } from './client/src/components/utils'; // Utility function to get file icons
import '../styles/styles.css'; // Ensure this path is correct

const DashboardTable = () => {
  const [students, setStudents] = useState([
    {
      name: 'Claire Johnson',
      submissions: [],
      grade: '',
      comments: ''
    },
    // Add more students here as needed
  ]);

  const handleNewSubmission = (newSubmission, index) => {
    const updatedStudents = [...students];
    updatedStudents[index].submissions = [
      ...updatedStudents[index].submissions,
      newSubmission
    ];
    setStudents(updatedStudents);
  };

  const addNewRow = () => {
    setStudents([...students, { name: '', submissions: [], grade: '', comments: '' }]);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Submission</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student, index) => (
              <React.Fragment key={index}>
                <TableRow style={{ borderTop: '1px solid #d3d3d3'}}>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <TextField
                      fullWidth
                      value={student.name}
                      onChange={(e) => {
                        const updatedStudents = [...students];
                        updatedStudents[index].name = e.target.value;
                        setStudents(updatedStudents);
                      }}
                      placeholder="Enter name"
                    />
                  </TableCell>
                  <TableCell style={{ borderBottom: 'none' }} colSpan={2}>
                    {student.submissions.map((submission, subIndex) => (
                      <div key={subIndex} style={{ display: 'flex', alignItems: 'left', gap: '5px' }}>
                        {getFileIcon(submission.fileName)}
                        <span>{submission.fileName}</span>
                        <span style={{ marginLeft: 'auto' }}>{submission.submittedOn.toLocaleDateString()}</span>
                      </div>
                    ))}
                    <ActionBar 
                      onFileUpload={(event) => {
                        const file = event.target.files[0];
                        if (file) {
                          handleNewSubmission({
                            fileName: file.name,
                            submittedOn: new Date(),
                          }, index);
                        }
                        event.target.value = ''; // Clear the file input
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <TextField
                      fullWidth
                      value={student.grade}
                      onChange={(e) => {
                        const updatedStudents = [...students];
                        updatedStudents[index].grade = e.target.value;
                        setStudents(updatedStudents);
                      }}
                      placeholder="Enter grade"
                    />
                  </TableCell>
                  <TableCell style={{ borderBottom: 'none' }}>
                    <TextField
                      fullWidth
                      value={student.comments}
                      onChange={(e) => {
                        const updatedStudents = [...students];
                        updatedStudents[index].comments = e.target.value;
                        setStudents(updatedStudents);
                      }}
                      placeholder="Enter comments"
                    />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
            <TableRow style={{ borderTop: '1px solid #d3d3d3'}}>
              <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                <IconButton onClick={addNewRow}>
                  <AddCircleOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default DashboardTable;



