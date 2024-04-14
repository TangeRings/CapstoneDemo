import React from 'react';
import '../styles/styles.css';
import Recorder from '../components/Recorder';
import MeetingNote from '../components/MeetingNote';

function MeetingPage(props) {
    // Access the meetingName from the URL parameters
    const meetingTitle = decodeURIComponent(props.match.params.meetingName);

    return (
        <div className="meeting-page-container">
            <div className="recorder">
                <Recorder title={meetingTitle} />
            </div>
            <div className="meeting-note">
                <MeetingNote />
            </div>
        </div>
    );
}

export default MeetingPage;



