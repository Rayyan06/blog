import React from 'react';
import { useEffect, useState } from "react";


const articleID = JSON.parse(document.querySelector("#article_id").textContent);

function Comments() {
    // Save a variable where we will store all the comments
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);



    const loadCommentList = () => {
        fetch(`/api/comments/${articleID}?format=json`)
        .then(res=>res.json())
        .then(data=>{
            setComments(data);
            setIsLoading(false);
        })
        .catch(error=>{
            console.log("Error: " + error);
            window.alert("ERROR: " + error)
        });
    }





    useEffect(()=>{

      loadCommentList();

    }, []);




    if (isLoading) {
        return <h5>Loading...</h5>
    }

    if (comments.length===0) {
        return <h5>No one has commented on this article yet! Be the first to comment</h5>
    }  else {
        return (
            <>
            {comments.map((comment)=>
            <Comment key={comment.id} comment={comment}/>

            )
            }
            </>
        );
    }


}


const addComment = (props) => {
    const [text, setText] = useState("");

    const saveComment = function() {
        let comment = {
            text: text,
            article: articleID
        }

    }
}
const Comment = (props) => {
    return (
        <div className='list-group-item'>
            <div className="d-flex w-100 justify-content-between">
                <small className="text-muted">
                    { props.comment.date }
                </small>
            </div>
            <p className="mb-1">{ props.comment.text }</p>
            <small className='text-muted'>
                by <strong>{ props.comment.user }</strong>
            </small>
        </div>

    )
}


export default Comments;