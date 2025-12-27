import { useState, useEffect, useRef } from 'react'
import "../pages/Camera.css"

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [stream, setStream] = useState(null);
  const [selected, setSelect] = useState(false);
  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");

  const value = hover || rating;

  const stars = [
    { low: 0.5, high: 1 },
    { low: 1.5, high: 2 },
    { low: 2.5, high: 3 },
    { low: 3.5, high: 4 },
    { low: 4.5, high: 5 }
  ];

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

  function uploadPhoto(e) {
    const file = e.target.files[0];
    if(!file) return;

    // create a url for the uploaded photo
    const url = URL.createObjectURL(file);
    setPhoto(url);
  }

   const retakePhoto = () => {
    setPhoto(null);
    setSelect(false);
    setHover(0);
    setRating(0);
  };

  function getClass(star) {
    if (value >= star.high) return "active-high";
    if (value === star.low) return "active-low";
    return "";
  }

  function moveMouse(e, star) {
    const {left, width} = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    if(percent <= 0.5) {
        setHover(star.low)
    }
    else {
        setHover(star.high)
    }
  }

  function handleClick(val) {
    setRating(val);
    // onChange?.(val);
  }

  async function handleSubmit() {
    
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/addEntry`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        photo: photo,
        rating: rating,
        comments: comments
      })
    });

    if(res.ok) {
      alert("Review submitted!");
    }
  }

//   if(!stream) {
//     return <div>Loading...</div>
//   }

  if(!photo) {
    return (
      <div>
        <div className="camera">
            <video className="video" ref={videoRef} autoPlay></video>
            <br/>
            <button id="start-button" onClick={() => takePicture()}>Take a photo</button>
            <label className="custom-upload" htmlFor="fileUpload">Upload</label>
            <input type="file" id="fileUpload" name="fileUpload" accept="image/*" onChange={uploadPhoto}/>
        </div>
  
        <canvas ref={canvasRef} hidden></canvas>
      </div>
  
    )
  }
  
  else if (photo && !selected){
    return (
      <div>
        <img className="video" src={photo}/>
        <br/>
        <button onClick={retakePhoto}>Retake</button>
        <button onClick={() => {setSelect(true)}}>Use Photo</button>
        <canvas ref={canvasRef} hidden></canvas>
      </div>
    )
  }
  else {
    return (
      <div>
        <span className="container">
        <div>
            <img className="video" src={photo}/>
            <br/>
            <button onClick={retakePhoto}>Retake</button>
            <button disabled={true}>Use Photo</button>
            <canvas ref={canvasRef} hidden></canvas>
        </div>

        <div className="ratingContainer">
            <p>Your rating: <strong>{rating}</strong></p>
            <div className="rating_stars">
            {stars.map((star, i) => (
                <span
                key={i}
                className={`s ${getClass(star)}`}
                onMouseMove={(e) => moveMouse(e, star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleClick(value)}
                >
                <i className="fa fa-star-o" />
                <i className="fa fa-star-half-o" />
                <i className="fa fa-star" />
                </span>
            ))}
            </div>
            <br/>
           
            <textarea placeholder="Share your thoughts..." onChange={(e) => {setComments(e.target.value)}}/>
            <button id="checkmark" onClick={handleSubmit}>✓</button>
        </div>
        </span>
      </div>
    )
  }
}

