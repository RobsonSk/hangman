import React, { useState } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import axios from 'axios';

const AudioRecorder = ({ onTranscription }) => {
    const { startRecording, stopRecording, audioData } = useAudioRecorder();
    const [isRecording, setIsRecording] = useState(false);

    const handleStart = () => {
        setIsRecording(true);
        startRecording();
    };

    const handleStop = async () => {
        const audioBlob = await stopRecording(true);
        setIsRecording(false);
        console.log(audioBlob);

        if (audioBlob && audioBlob instanceof Blob) {
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
            console.error('Failed to create a valid audio blob.');
        }
    };

    return (
        <div>
            <button onClick={handleStart} disabled={isRecording}>Start Recording</button>
            <button onClick={handleStop} disabled={!isRecording}>Stop Recording</button>
            {audioData && <audio src={URL.createObjectURL(audioData)} controls />}
        </div>
    );
};

export default AudioRecorder;
