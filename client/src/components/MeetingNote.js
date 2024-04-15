import React, { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Typography, Paper, Box } from '@mui/material';

function MeetingNote() {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState([]);
    const [actionItems, setActionItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleContentEditableChange = (index, event) => {
        const updatedActionItems = [...actionItems];
        updatedActionItems[index].label = event.target.innerText;
        setActionItems(updatedActionItems);
    };

    const handleSubmit = async () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const response = await fetch('http://localhost:7070/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            const data = await response.json();

            // Assuming summary is an array of strings
            setSummary(data.summary);

            // Assuming actionItems is already an array of objects { label: '...', checked: false }
            setActionItems(data.actionItems);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process file.');
        }
        setLoading(false);
    };

    const handleCheckboxChange = (index) => (event) => {
        const updatedActionItems = actionItems.map((item, i) => {
            if (index === i) {
                return { ...item, checked: event.target.checked };
            }
            return item;
        });
        setActionItems(updatedActionItems);
    };

    const handleTextChange = (index) => (event) => {
        const updatedActionItems = actionItems.map((item, i) => {
            if (index === i) {
                return { ...item, label: event.target.value };
            }
            return item;
        });
        setActionItems(updatedActionItems);
    };



    return (
        <Box p={0}>
            <h1 className="title">Feedback Analysis</h1>
            <input
                type="file"
                onChange={handleFileChange}
                accept=".txt"
                style={{ display: 'block', margin: '20px 0' }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Processing...' : 'Upload and Analyze'}
            </Button>
            <Paper style={{ margin: '20px 0', padding: '15px' }}>
                <Typography variant="h6">Summary</Typography>
                <Box component="ul" sx={{ m: 0, p: 0, listStyleType: 'disc', ml: 3 }}>
                    {summary.map((point, index) => (
                        <li key={index}><Typography>{point}</Typography></li>
                    ))}
                </Box>
            </Paper>
            <Box sx={{ margin: '20px 0' }}>
                {actionItems.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Checkbox
                            checked={item.checked}
                            onChange={handleCheckboxChange(index)}
                            color="primary"
                        />
                        <Box
                            component="div"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(event) => handleContentEditableChange(index, event)}
                            sx={{ 
                                flexGrow: 1, 
                                overflowWrap: 'break-word', 
                                cursor: 'text' ,
                                padding: '8px',
                                borderRadius: '4px',
                                background: 'white',
                                transition: 'background 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    background: '#f5f5f5', 
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                    borderRadius: '4px',
                                },
                                '&:focus': {
                                     outline: 'none',
                                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                     background: '#f5f5f5', 
                                },
                                }}
                            role="textbox"
                            aria-multiline="true"
                        >
                            {item.label}
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default MeetingNote;