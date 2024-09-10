import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { MediaRecorder, register } from 'extendable-media-recorder';

const AudioRecorder = () => {
    const [audioBlob, setAudioBlob] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [capturedStream, setCapturedStream] = useState(null);

    useEffect(() => {
        register();
    }, []);

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
            }
        }).then(stream => {
            setCapturedStream(stream);
            setIsRecording(true);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/wav'
            });

            mediaRecorder.addEventListener('dataavailable', event => {
                const audioBlobs = [];
                audioBlobs.push(event.data);
                setAudioBlob(new Blob(audioBlobs, { type: mediaRecorder.mimeType }));
            });

            mediaRecorder.start();
        }).catch((e) => {
            console.error(e);
        });
    };

    const stopRecording = () => {
        setIsRecording(false);
        capturedStream.getTracks().forEach(track => track.stop());
        saveAs(audioBlob, 'recording.wav');
    };

    const playAudio = () => {
        if (audioBlob) {
            const audio = new Audio();
            audio.src = URL.createObjectURL(audioBlob);
            audio.play();
        }
    };

    return (
        <div>
            <button onClick={startRecording} disabled={isRecording} >Start Recording</button>
            <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
            <button onClick={playAudio} disabled={!audioBlob}>Play</button>
        </div>
    );
};

export default AudioRecorder;

