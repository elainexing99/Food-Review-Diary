import { useEffect, useState } from "react";

export default function Home() {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState(null);

    async function getReviews() {
        const res = await fetch("http://localhost:3000/reviews", {
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

     useEffect(() => {
        getReviews();

        async function fetchUserData() {
            const res = await fetch("http://localhost:3000/user/me", {
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

        fetchUserData();

    }, []);


    if(user) {

        return(
            <>
            
            <h2>{user.firstName}'s Food Review Diary</h2>
            <div className="reviewContainer">
                {reviews && reviews.map((review) => (
                    <div key={review.id}>
                        <img src={review.photourl} alt="Food Photo" width="200"/>
                        <p>{formatDateTime(review.date)}</p>
                        <p>Rating: {review.rating}/5</p>
                        <p>Comments: {review.opinion}</p>
                    </div>
                ))}
            </div>
                
            </>
        )
    }
    else {
        return <h2>Login to see your reviews!</h2>
    }
}