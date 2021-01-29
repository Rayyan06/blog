import React from "react";
import Cookies from "js-cookie";
import {useState, useEffect} from "react";



const articleID = JSON.parse(document.querySelector("#article_id").textContent);
const articleTitle = JSON.parse(document.querySelector("#article_title").textContent);
const user_is_authenticated = JSON.parse(document.querySelector("#user_is_authenticated").textContent);


const csrftoken = Cookies.get('csrftoken');



export default function LikesElement() {
    const [likes, setLikes] = useState(0);

    const getLikesAmount = () => {
        const getLikes = async() => {
            const response = await fetch(`/article/${articleID}/likes`)
            const jsonResponse = await response.json();
            return jsonResponse;
        }

        getLikes()
        .then(data=>{
            setLikes(data.likes)
            console.log(data)
        })
    }

    useEffect(()=>{
        getLikesAmount();
    }, [])



    return (
        <>
            <div className="col-md-9">
                <h1>{articleTitle}</h1>
            </div>
            <LikeButton likeCallback={()=>getLikesAmount()}/>
            <div className="col">
                <h4><span id="likes" className="badge bg-danger">{likes} Likes</span></h4>
            </div>
        </>
    )




}


function LikeButton(props) {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(false);


    const getLiked = () => {
        fetch(`/article/${articleID}/like`)
        .then(res=>res.json())
        .then(data=>{
            setLiked(data.content);

        })
    }

    const like = async() => {
        setLoading(true);
        const response = await fetch(`/article/${articleID}/like`, {
            method: 'PUT',
            body: {
                liked: !liked
            },
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })

        const jsonResponse = await response.json();
        return jsonResponse;

    }


    const handleButtonClick=()=> {
        like()
        .then(data=>{
            console.log(data);
            setLiked(data.liked);
            setLoading(false);
            props.likeCallback();



        })
        .catch(error=>{
            console.log(error);
            window.alert(error);
        })

    }

    useEffect(()=>{
        getLiked();
    })


    const IconClass = liked ? 'far' : 'fas';

    return (
        <div className="col">
            <button className="btn btn-outline-light border" id="like-button" onClick={()=>handleButtonClick()} disabled={(!user_is_authenticated)|loading}>
                <span id="like-text">{liked ? "Like   " : "Dislike "}</span>
                <i id="like-icon" className={IconClass + ' fa-heart pull-right'}></i>
            </button>
        </div>
    )


}
