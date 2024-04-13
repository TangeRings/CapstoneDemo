import React, { useState } from 'react';
import StudentRow from './StudentRow';
import Button from '@mui/material/Button';
import axios from 'axios';


const DashboardTable = () => {
    const [students, setStudents] = useState([{ id: 1, name: 'Claire', files: [] }]);
    const fileInputRef = React.useRef(null);  // Using a ref to access the file input directly

    const addStudent = () => {
        const newStudent = {
            id: students.length + 1,
            name: `Student ${students.length + 1}`,
            files: []
        };
        setStudents(students.concat(newStudent));
    };

    const handleSyllabusUpload = async (event) => {
        const file = event.target.files[0];
        if (file && file.type === "application/pdf") {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // Upload the file to the server
                const response = await axios.post('http://127.0.0.1:5050/syllabus', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    alert('Syllabus uploaded successfully!');
                }
            } catch (error) {
                console.error('Error uploading syllabus:', error);
                alert('Failed to upload syllabus.');
            } finally {
                // Clear the file input after upload (even if failed) to allow re-uploading the same file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } else {
            alert('Please select a PDF file to upload.');
        }
    };

    return (
        <div>
            <input
                ref={fileInputRef}
                accept="application/pdf"
                style={{ display: 'none' }}
                id="syllabus-upload"
                type="file"
                onChange={handleSyllabusUpload}
            />
            <label htmlFor="syllabus-upload">
                <Button variant="contained" color="secondary" component="span" style={{ marginBottom: '20px' }}>
                    Upload Syllabus
                </Button>
            </label>
            <button onClick={addStudent} style={{ marginBottom: '20px' }}>Add Student</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Upload</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map(student => (
                        <StudentRow key={student.id} student={student} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardTable;
