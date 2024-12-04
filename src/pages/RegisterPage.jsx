import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const RegistroAsistencias = () => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [recognitionResult, setRecognitionResult] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };
    startCamera();
  }, []);

  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      setCapturedImage(blob);
      sendImageToBackend(blob);
    },"image/jpeg");
  };

  const sendImageToBackend = async (blob) => {
    const formData = new FormData();
    formData.append('image', blob);

    try {
      const response = await axios.post('http://localhost:3000/api/asistencia/reconocimiento-facial', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRecognitionResult(response.data.message);
    } catch (error) {
      console.error('Error en el reconocimiento facial:', error);
    }
  };

  return (
    <div>
      <h1>Reconocimiento Facial</h1>
      <video ref={videoRef} autoPlay width="640" height="480"></video>
      <button onClick={captureImage}>Capturar imagen</button>

      {recognitionResult && <p>Resultado: {recognitionResult}</p>}
    </div>
  );
};


export default RegistroAsistencias;
