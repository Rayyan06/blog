import React from 'react';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";




const articleID = JSON.parse(document.querySelector("#article_id").textContent);
const user_is_authenticated = JSON.parse(document.querySelector("#user_is_authenticated").textContent);


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
            window.alert("ERROR: " + error);
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
            <hr />
            <CommentList comments={comments}/>



            </>
        );
    }


}


const AddCommentWidget = (props) => {
    const [text, setText] = useState("");
    const [errors, setErrors] = useState({"text": [""]});
    const [fetching, setFetching] = useState(false);


    const saveComment = function() {


        let comment = {
            text: text,
            article: articleID
        }
        setFetching(true);

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
            setFetching(false);
            if (Array.isArray(data.text)) {
                setErrors(data);
            } else {
                setText("");
                setErrors({"text": [""]});

            }

        })
        .catch(error=>{
            console.log('Error' + error);
            window.alert(error.text);
            setErrors(error);
        })

    }

    let isValid = errors.text[0] ? "is-invalid" : "is-valid";
    let commentButtonText = fetching ? <>Commenting <i class="fas fa-spinner"></i></> : "Comment";

    return (
        <div className="container py-3 add-comment-form">
            <div className="mb-3 add-comment-input">

                <label htmlFor="comment-text">Comment Text</label>
                <textarea id="comment-text" placeholder="Comment Text" className='add-comment-area' value={text} onChange={(event)=>setText(event.target.value)} required/>

                { isValid ?
                    <div className="feedback-error">{errors.text[0]}</div>
                : ''
                }

                 <div className="feedback">{`${text.length} Characters`}</div>


            </div>
            <div className="mb-3">
                {user_is_authenticated ?
                    <button id="save-comment" type="button" onClick={() => saveComment()} disabled={(!text)|fetching|(text>200)}>{commentButtonText}</button>
                :   <span className="d-inline-block" tabindex="0" data-toggle="tooltip" title="You must be authenticated to comment">
                        <button id="save-comment" type="button" onClick={() => saveComment()} disabled>Sign in to comment</button>
                    </span>
                }
            </div>
        </div>

    );
}
const CommentList = (props) => {
    if (props.comments) {
        if (props.comments.length===0) {

            return (
            <div className="m-3">
                <h5>No one has commented on this article yet! Be the first to comment!</h5>
            </div>
            );

        }  else {
            return (
                <>
                {props.comments.map((comment, index)=>
                    <Comment comment={comment} index={index}/>
                )}
                </>

            )
        }

    } else {
        return <></>
    }
}



const Comment = (props) => {

    return (
        <div className="comment" id={`comment-${props.index}`}>
            <a href={`#comment-${props.index}`} className="comment-border-link"></a>

            <div className="comment-heading">
                <div className="comment-voting">

                    <button type="button" className="icon-button">
                        <i className="fas fa-chevron-up"></i>
                    </button>
                    <button type="button" className="icon-button">
                        <i className="fas fa-chevron-down"></i>
                    </button>

                </div>
                <div className="comment-info">
                    <a href="#" className="comment-author">{props.comment.user}</a>
                    <p className="m-0">
                        37 points &bull; {props.comment.date}
                    </p>

                </div>
            </div>
            <div className="comment-body">
                <p>
                    {props.comment.text}
                </p>
                <button type="button" className="icon-button" id="reply-button">Reply <i class="fas fa-reply"></i></button>
                <button type="button" className="icon-button" id="flag-button">Flag <i class="fas fa-flag"></i></button>
            </div>

            <div className="replies">

            </div>

        </div>
    );

}

export default Comments;