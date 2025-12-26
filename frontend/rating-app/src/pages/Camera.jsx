import { useState, useEffect, useRef } from 'react'
import "../pages/Camera.css"

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);


  // when the page loads, ask the user for camera permissions
  useEffect(() => {
    let mediaStream;
    
    async function cameraPermission() {
      mediaStream = await navigator.mediaDevices.getUserMedia({ video: true})
      videoRef.current.srcObject = mediaStream;
      //videoRef.current.play();
      setStream(mediaStream);
    }
    
    cameraPermission();
    
    // turns off the camera when unmounts
    return () => {
      mediaStream?.getTracks().forEach(track => track.stop());
    };

  }, [])


// display the video stream if retake photo is clicked
 useEffect(() => {
  if (!photo && videoRef.current && stream) {
    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(err => console.log(err));
  }
}, [photo, stream]);


  function takePicture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    // wait until metadata is loaded
    if (!video || video.videoWidth === 0) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    
    context.drawImage(video, 0, 0);

    const data = canvas.toDataURL("image/png");
    setPhoto(data);
    
  }

   const retakePhoto = () => {
    setPhoto(null);
  };

  const confirmPhoto = () => {
    // onCapture(photo);
    console.log("Photo confirmed: ", photo);
  };

  if(!photo) {
    return (
      <div>
        <div className="camera">
            <video className="video" ref={videoRef} autoPlay></video>
            <br/>
            <button id="start-button" onClick={() => takePicture()}>Take a photo</button>
            <button>Upload</button>
            <input type="file" hidden/>
        </div>
  
        <canvas ref={canvasRef} hidden></canvas>
      </div>
  
    )
  }
  
  else {
    return (
      <div>
        <img className="video" src={photo}/>
        <br/>
        <button onClick={retakePhoto}>Retake</button>
        <button onClick={confirmPhoto}>Use Photo</button>
        <canvas ref={canvasRef} hidden></canvas>
      </div>
    )
  }
}

