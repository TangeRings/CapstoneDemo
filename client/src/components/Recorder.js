import React, { useState, useEffect } from 'react';
import { Button, Card, Typography } from '@mui/material';
import { Mic, Stop } from '@mui/icons-material';
import axios from 'axios';

function Recorder({ title }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [audioIntervalId, setAudioIntervalId] = useState(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setMediaRecorder(new MediaRecorder(stream));
      })
      .catch(error => {
        console.error("Microphone access was denied.", error);
        alert("Microphone access is required to record audio.");
      });
  }, []);

  const sendAudioData = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      const response = await axios.post('http://localhost:8080/transcribe-audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTranscript(prevTranscript => prevTranscript + ' ' + response.data.transcript);
    } catch (err) {
      console.error('Error sending audio to the server:', err);
    }
  };

  const startRecording = () => {
    setIsRecording(true);

    const createRecorder = (stream) => {
      const recorder = new MediaRecorder(stream);

      recorder.addEventListener('dataavailable', async (event) => {
        if (event.data.size > 0) {
          sendAudioData(event.data);
        }
      });

      recorder.start();
      // Stop recording after 2 seconds and handle data available
      setTimeout(() => {
        recorder.stop();
      }, 2000);
    };

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        createRecorder(stream); // Start recording initially

        // Set interval to stop current recorder and start a new one every 2 seconds
        const intervalId = setInterval(() => {
          if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
          createRecorder(stream);
        }, 2000);

        setAudioIntervalId(intervalId);
      })
      .catch(error => {
        console.error("Microphone access was denied.", error);
        alert("Microphone access is required to record audio.");
        setIsRecording(false);
      });
  };

  const stopRecording = () => {
    if (audioIntervalId) {
      clearInterval(audioIntervalId);
      setAudioIntervalId(null);
    }
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
    setIsRecording(false);
  };

  return (
    <div>
      <h1>{title}</h1>
      <Button
        variant="contained"
        color={isRecording ? "secondary" : "primary"}
        startIcon={isRecording ? <Stop /> : <Mic />}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Card style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="body1">
          {transcript || 'Transcripts will appear here...'}
        </Typography>
      </Card>
    </div>
  );
}

export default Recorder;

