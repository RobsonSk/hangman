import React, { useState, useRef } from 'react';
import axios from 'axios';

const AudioRecorder = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = event => {
          setAudioChunks(prev => [...prev, event.data]);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          console.log('Audio Blob Size:', audioBlob.size);
          if (audioBlob.size > 0) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.wav');
        
            try {
              const response = await axios.post('http://localhost:3000/speech-to-text', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              onTranscription(response.data.transcription);
            } catch (error) {
              console.error('Error sending audio data:', error);
            }
          } else {
            console.error('Recording failed, audioBlob is empty');
          }
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      })
      .catch(error => console.error('Error accessing microphone:', error));
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
    </div>
  );
};

export default AudioRecorder;
