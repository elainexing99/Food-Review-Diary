import { useEffect, useState } from "react";
// import {moveMouse, handleClick} from "./Camera.jsx";

export default function Home() {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);
    const [hoverId, setHover] = useState(null);
    const [folders, setFolders] = useState([]);
    const [edit, setEdit] = useState(null);
    const [newFolder, setNew] = useState(false);
    const [move, setMove] = useState(null);

    const [hover, setMouseHover] = useState(0);
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

  function getClass(star) {
    if (value >= star.high) return "active-high";
    if (value === star.low) return "active-low";
    return "";
  }

  function moveMouse(e, star) {
    const {left, width} = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    if(percent <= 0.5) {
        setMouseHover(star.low)
    }
    else {
        setMouseHover(star.high)
    }
  }

  function handleClick(val) {
    setRating(val);
    // onChange?.(val);
  }

    async function getReviews(id) {

            const url = id !== "All Reviews"
            ? `${import.meta.env.VITE_API_BASE_URL}/reviews?folderId=${id}`
            : `${import.meta.env.VITE_API_BASE_URL}/reviews`;      
            console.log(url);

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                } 
            })

            if(res.ok) {
                const data = await res.json();
                setReviews(data);
    
                console.log(data);
            }
    }

    function formatDateTime(dateTimeStr) {
        if (!dateTimeStr) return "N/A";
        try {
            const date = new Date(dateTimeStr);
            return date.toLocaleString();
        } catch (error) {
            return dateTimeStr;
        }
    }

    async function editPost() {
        // alert("Edit post for: " + edit + " coming soon!");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reviews/${edit}`, {
            method: "PATCH",
            headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
            body: JSON.stringify(
                {rating: rating,
                comments: comments}
            )

        })

        if(res.ok) {
            const data = res.json();
            console.log(data);
        }
    }

    async function movePost() {
        // alert("Move post coming soon!");
        const newName = document.getElementById("folderName")

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/moveEntry/${newName.value}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                reviewId: move
            })
        })

        if(res.ok) {
            const data = await res.json();
            console.log(data);
            setMove(null);
        }
    }

    async function fetchUserData() {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        console.log(res);

        if(res.ok) {
            const data = await res.json();
            console.log(data);
            setUser(data);
        }

    }
    
    async function fetchFolders() {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/folders`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        })

        console.log(res);

        if(res.ok) {
            const data = await res.json();
            console.log(data);
            setFolders(data);
        }
    }

    async function createFolder() {
        const newName = document.getElementById("newFolder")
        
        console.log("name: " + newName.value);
        console.log(newName);

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/createFolder`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newName.value
            })
        })

        if(res.ok) {
            fetchFolders();
            
            setNew(false);
        }

    }

     useEffect(() => {
        getReviews("All Reviews");

        fetchUserData();
        fetchFolders();

    }, []);


    if(user) {

        return(
            <>
        
            <h2 id="title">{user.firstName}'s Food Review Diary</h2>
            <div className="folderContainer">
                {/* <label>View a folder</label> */}
                
                <select onChange={(e) => getReviews(e.target.value)}>
                    <option selected>All Reviews</option>
                    {folders && folders.map((folder) => (
                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                </select>
                
                <button onClick={() => setNew(true)}>New Folder <span id="plusSymbol">+</span></button>
                {newFolder && (
                    <div className="modalOverlay">
                        <div className="modal">
                            <label id="newFolderLabel">Add a Folder:</label>
                            <input className="input" id="newName" type="text" placeholder="New Folder"/>
                            <br/>
                            <button onClick={() => {createFolder()}}>Submit</button>
                            <button onClick={() => setNew(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="reviewContainer">
                {/* all reviews */}
                {reviews && reviews.map((review) => (
                    <div id="postContainer" key={review.id} 
                        onMouseOver={() => setHover(review.id)} 
                        onMouseLeave={() => setHover(null)}
                        
                    >
                        <img src={review.photourl} alt="Food Photo" width="200" onClick={() => setMove(review.id)}/>
                        {hoverId === review.id && <p id="text" onClick={(e) => {e.stopPropagation(); setEdit(review.id)}}>Edit</p>}
                        <p id="date">{formatDateTime(review.date)}</p>
                        <p><strong>Rating:</strong> {review.rating}/5</p>
                        <p id="comments"><strong>Comments:</strong> {review.opinion}</p>
                
                        <hr style={{ width: "100%", borderTop: "3px dashed #63c5da" }}/>
                    </div>
                    

                ))}
                

                {edit && 
                <div className="modalOverlay">
                    <div className="modal">

                        <div className="ratingContainer">
                        <p>Your rating: <strong>{rating}</strong></p>
                        <div className="rating_stars">
                        {stars.map((star, i) => (
                            <span
                            key={i}
                            className={`s ${getClass(star)}`}
                            onMouseMove={(e) => moveMouse(e, star)}
                            onMouseLeave={() => setMouseHover(0)}
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
                    </div>
                        <br/>
                        <button onClick={() => {editPost()}}>Update</button>
                        <button onClick={() => {setEdit(null); setRating(0)}}>Cancel</button>
                    </div>
                </div>
                }

                {move && (
                <div className="modalOverlay">
                    <div className="modal">
                        <label>Move to a Folder:</label>
                        <input className="input" id="folderName" type="text" placeholder="Folder Name"/>
                        <br/>
                        <button onClick={() => {movePost()}}>Move</button>
                        <button onClick={() => setMove(null)}>Cancel</button>
                    </div>
                </div>
                )}

            </div>
                
            </>
        )
    }
    else {
        return <h2>Login to see your reviews!</h2>
    }
}