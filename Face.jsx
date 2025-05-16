import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

function Face() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [images, setImages] = useState([]);
  const [captureCount, setCaptureCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [attentivenessScore, setAttentivenessScore] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const intervalTime = 12 * 1000;
  const totalCaptures = 5;

  // ✅ Load face detection model from /public/models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
        console.log('Model loaded successfully.');
      } catch (error) {
        console.error('Model loading error:', error);
      }
    };
    loadModels();
  }, []);

  // Start/stop camera
  useEffect(() => {
    if (isCameraOn && captureCount < totalCaptures) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing the camera:', error);
        });

      if (!startTime) {
        setStartTime(new Date());
      }
    } else {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn, captureCount]);

  // Auto-capture images
  useEffect(() => {
    if (captureCount < totalCaptures && isCameraOn) {
      const interval = setInterval(() => {
        captureImage();
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [captureCount, isCameraOn]);

  const captureImage = () => {
    if (captureCount < totalCaptures) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setImages((prevImages) => [...prevImages, { img: dataUrl, time: new Date() }]);
      setCaptureCount((prev) => prev + 1);
    }
  };

  const getElapsedTime = (startTime) => {
    if (!startTime) return 'N/A';
    const now = new Date();
    const elapsedTime = Math.floor((now - startTime) / 1000);
    return `${elapsedTime}s`;
  };

  const evaluateAttentiveness = async () => {
    setIsEvaluating(true);
    let score = 0;

    for (const image of images) {
      try {
        const imgElement = await faceapi.fetchImage(image.img);
        const detection = await faceapi.detectSingleFace(imgElement);

        if (detection) {
          score += 1; // 1 point per face detected (attentive)
        }
      } catch (err) {
        console.error('Error detecting face:', err);
      }
    }

    setAttentivenessScore(score);
    setIsEvaluating(false);
  };

  return (
    <div className="App" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React Auto Camera Capture for Monitoring</h1>

      <button onClick={() => setIsCameraOn(!isCameraOn)}>
        {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>

      {isCameraOn && (
        <div style={{ marginTop: '20px' }}>
          <video ref={videoRef} autoPlay width="640" height="480" />
          <p>Monitoring... Capturing every 12 seconds.</p>
          <p>Elapsed Time: {getElapsedTime(startTime)}</p>
        </div>
      )}

      <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }} />

      <div style={{ marginTop: '20px' }}>
        <h3>Captured Photos ({captureCount}/{totalCaptures}):</h3>
        {images.map((image, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <h4>Photo {index + 1} - Captured at: {image.time.toLocaleTimeString()}</h4>
            <img src={image.img} alt={`Captured ${index + 1}`} width="300" />
          </div>
        ))}
      </div>

      {captureCount === totalCaptures && (
        <div style={{ marginTop: '30px' }}>
          <p>Monitoring complete! All photos have been captured.</p>
          <button onClick={evaluateAttentiveness} disabled={isEvaluating}>
            {isEvaluating ? 'Evaluating...' : 'Evaluate Attentiveness'}
          </button>

          {attentivenessScore !== null && !isEvaluating && (
            <div style={{ marginTop: '20px' }}>
              <h3>Attentiveness Score: {attentivenessScore} / {totalCaptures}</h3>
              <div>
                {Array.from({ length: totalCaptures }, (_, index) => (
                  <span
                    key={index}
                    style={{
                      fontSize: '24px',
                      color: index < attentivenessScore ? '#ffc107' : '#ddd'
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Face;
