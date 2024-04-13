// ActionBar.js
import React from 'react';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EventIcon from '@mui/icons-material/Event'; // Google Calendar sync icon
import MicIcon from '@mui/icons-material/Mic'; // Sound record icon
import EmailIcon from '@mui/icons-material/Email'; // Email icon
import GetAppIcon from '@mui/icons-material/GetApp'; // Download icon

const ActionBar = ({
  onUploadClick,
  onRecordClick,
  onCalendarSyncClick,
  onEmailClick,
  onDownloadClick
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <IconButton color="primary" onClick={onUploadClick}>
        <CloudUploadIcon />
      </IconButton>
      <IconButton color="primary" onClick={onCalendarSyncClick}>
        <EventIcon />
      </IconButton>
      <IconButton color="primary" onClick={onRecordClick}>
        <MicIcon />
      </IconButton>
      <IconButton color="primary" onClick={onEmailClick}>
        <EmailIcon />
      </IconButton>
      <IconButton color="primary" onClick={onDownloadClick}>
        <GetAppIcon />
      </IconButton>
    </div>
  );
};

export default ActionBar;

