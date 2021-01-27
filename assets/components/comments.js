import React from 'react';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";




const articleID = JSON.parse(document.querySelector("#article_id").textContent);
const csrftoken = Cookies.get('csrftoken');

function Comments() {
    // Save a variable where we will store all the comments
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const commentSaved=()=> {
        loadCommentList();
    }

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

    else {
        return (
            <>
            <AddCommentWidget commentSaved={commentSaved}/>
            <CommentList comments={comments}/>

            
            
            </>
        );
    }


}


const AddCommentWidget = (props) => {
    const [text, setText] = useState("");

    const saveComment = function() {
        let comment = {
            text: text,
            article: articleID
        }

        fetch(`/api/comments/${articleID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(comment)
        

        })
        .then(res=>res.json())
        .then(data=>{
            console.log('Success' + data)
            props.commentSaved();
        }
        )
        .catch(error=>console.log('Error' + error))

    }

    return (
        <div className="container py-3">
            <div className="mb-3">
                <label htmlFor="comment-text" className="form-label">Text</label>
                <input id="comment-text" type="text" placeholder="Comment Text" className="form-control" value={text} onChange={(event)=>setText(event.target.value)}/>
            </div>
            <div className="mb-3">
                <button className="btn btn-outline-primary" type="button" onClick={() => saveComment()}>Comment</button>
            </div>
        </div>
        
    );
}
const CommentList = (props) => {
    if (comments.length===0) {
        return <h5>No one has commented on this article yet! Be the first to comment</h5>
    }  else {
        return (
            <>
            {props.comments.map((comment)=>
                <div className='list-group-item'>
                    <div className="d-flex w-100 justify-content-between">
                        <small className="text-muted">
                            { comment.date }
                        </small>
                    </div>
                    <p className="mb-1">{ comment.text }</p>
                    <small className='text-muted'>
                        by <strong>{ comment.user }</strong>
                    </small>
                </div>
            )}
            </>

        )
    }
}


export default Comments;