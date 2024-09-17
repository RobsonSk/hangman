//AudioRecorder.js
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const { t, i18n } = useTranslation()

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream ,{
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  // Stop recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // Send audio to backend API
  const sendAudioToServer = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    try {
      const response = await fetch('http://localhost:3000/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log(response.text);
        console.log('Audio successfully sent to server');
      } else {
        console.error('Failed to send audio to server');
      }
    } catch (err) {
      console.error('Error sending audio:', err);
    }
  };

  return (
    <div className='audio-recorder'>
      <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? t("Stop Recording") : t("Start Recording")}
      </button>
      {audioBlob && (
        <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={sendAudioToServer}>
          {t("Send Audio to Server")}
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;