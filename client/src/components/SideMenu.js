// src/components/SideMenu.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder'; // Using Folder icon for "Files"
import InboxIcon from '@mui/icons-material/MoveToInbox'; // Assuming this is the Kanban icon
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { grey } from '@mui/material/colors';

const drawerWidth = 240;

const SideMenu = () => {
  const [openFiles, setOpenFiles] = useState(false);

  const handleFilesClick = () => {
    setOpenFiles(!openFiles);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: grey[800],
        },
      }}
    >
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" 
          sx={{ 
            bgcolor: grey[800], 
            color: grey[50], 
            mt:3, 
            ml:3,
            fontSize: '1rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px black, 0 0 1em grey, 0 0 0.2em grey',}}>
            CAPSTONE ASSISTANT
          </ListSubheader>
        }
        sx={{ color: grey[300] }}
      >
        <ListItem button>
          <ListItemIcon sx={{ color: grey[300] }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={handleFilesClick}>
          <ListItemIcon sx={{ color: grey[300] }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="Files" />
          {openFiles ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openFiles} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button sx={{ pl: 4, bgcolor: grey[800] }}>
              <ListItemIcon sx={{ color: grey[50] }}>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Kanban Board" sx={{ color: grey[50] }} />
            </ListItem>
            {/* ...other nested items */}
          </List>
        </Collapse>

        {/* ...rest of the items */}
      </List>
    </Drawer>
  );
};

export default SideMenu;


