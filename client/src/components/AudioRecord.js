import React, { useState, useEffect } from 'react';
import { Button, Card, Typography } from '@mui/material';
import { Mic, Stop } from '@mui/icons-material';
import axios from 'axios';

function Recorder({ title }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [chunks, setChunks] = useState([]);
  const [audioIntervalId, setAudioIntervalId] = useState(null);

  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Your browser does not support audio recording.");
      return;
    }

    const getMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
      } catch (err) {
        alert("Microphone access is required to record audio.");
        console.error(err);
      }
    };

    getMicrophoneAccess();
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

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setChunks(prevChunks => prevChunks.concat(event.data));
    }
  };

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start();
      setIsRecording(true);

      const intervalId = setInterval(() => {
        if (chunks.length > 0) {
          const audioBlob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
          sendAudioData(audioBlob);
          setChunks([]);
        }
      }, 2000);
      setAudioIntervalId(intervalId);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      clearInterval(audioIntervalId);
      setAudioIntervalId(null);
      setIsRecording(false);
      if (chunks.length > 0) {
        const audioBlob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
        sendAudioData(audioBlob);
        setChunks([]);
      }
    }
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

