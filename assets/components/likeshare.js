import React from "react";
import Cookies from "js-cookie";
import {useState, useEffect} from "react";



const articleID = JSON.parse(document.querySelector("#article_id").textContent);

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
        <LikeButton likeCallback={()=>getLikesAmount()}/>
        <div className="col">
            <h4><span className="badge bg-danger">{likes} Likes</span></h4>
        </div>
        </>
    )




}


function LikeButton() {
    const [liked, setLiked] = useState(false);



    const getLiked = () => {
        fetch(`/article/${articleID}/like`)
        .then(res=>res.json())
        .then(data=>{
            setLiked(data.content);

        })
    }

    const like = async() => {
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



    return (
        <div className="col">
            <button className="btn btn-outline-light border" onClick={()=>handleButtonClick()}disabled={!user_is_authenticated}>
                <span>{liked ? "Dislike" : "Like"}</span>
                <i className={liked ? 'fas' : 'far' + 'fa-heart pull-right'}></i>
            </button>
        </div>
    )


}
