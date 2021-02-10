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
        return (
            <div className="d-flex justify-content-center">
              <div className="spinner-grow spinner text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow spinner text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <div className="spinner-grow spinner text-secondary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
        );
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
    const [textLabel, setTextLabel] = useState("Enter Comment Text");
    const [isValid, setIsValid] = useState("");


    const replyForm = () => {
        return (
            <div className="container py-3 add-comment-form">
                <div className="mb-3 add-comment-input">

                    <label htmlFor="comment-text">Reply Text</label>
                    <textarea id="comment-text" placeholder="Comment Text" className='form-control' value={text} onChange={(event)=>setText(event.target.value)} required/>

                    { isValid ?
                        <div className="invalid-feedback">{`${text.length} Characters ${errors.text[0]}`}</div>
                    : ''
                    }

                    <div className="valid-feedback">{`${text.length} Characters`}</div>


                </div>
                <div className="mb-3">
                    {user_is_authenticated ?
                        <button id="save-comment" type="button" onClick={() => saveComment()} disabled={(!text)|fetching|(text>200)}>{replyButtonText}</button>
                    :   <span className="d-inline-block" tabindex="0" data-toggle="tooltip" title="You must be authenticated to comment or reply">
                            <button id="save-comment" type="button" onClick={() => saveComment()} disabled>Sign in to comment or reply</button>
                        </span>
                    }
                </div>
            </div>
        )
    }

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



    useEffect(()=>{
        if (text.length!==0) {
            if (text.length<=200) {
                setIsValid("is-valid");
                setTextLabel(`${text.length} Characters`);
            } else {
                setIsValid("is-invalid");
                if (errors.text[0]) {
                    setTextLabel(`${errors.text[0]} (Currently ${text.length} characters)`)
                } else {
                    setTextLabel(`Field may not be longer than 200 characters (Currently ${text.length} characters)`)
                }
            }
        } else {
            setTextLabel(`Enter comment text here`);
        }



    }, [text])


    let replyButtonText = fetching ? <>Replying <i className="fas fa-spinner"></i></> : "Reply";
    let commentButtonText = fetching ? <>Commenting <i className="fas fa-spinner"></i></> : "Comment";

    return (
        <div className="container py-3 add-comment-form">
            <div className="mb-3 form-floating">

                <textarea id="comment-text-input" placeholder="Comment Text" className={`form-control ${isValid}`} value={text} onChange={(event)=>setText(event.target.value)} required/>

                <label htmlFor="comment-text-input">{textLabel}</label>

            </div>
            <div className="mb-3">
                {user_is_authenticated ?
                    <button id="save-comment" className="btn btn-primary" type="button" onClick={() => saveComment()} disabled={(!text)|fetching|(text>200)}>{commentButtonText}</button>
                :   <span className="d-inline-block" tabindex="0" data-toggle="tooltip" title="You must be authenticated to comment">
                        <button id="save-comment" className="btn btn-primary" type="button" onClick={() => saveComment()} disabled>Sign in to comment</button>
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
    let replies = null;





    const showReplies = () => {
        if (props.replies) {
            replies = props.replies.map((reply, index)=>
                <Comment comment={reply} index={`reply-${index}`} />
            )
        }
    }

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
                <p className="comment-text">
                    {props.comment.text}
                </p>
                <button type="button" className="btn btn-sm btn-outline-primary me-2" id="reply-button">Reply <i class="fas fa-reply"></i></button>
                <button type="button" className="btn btn-sm btn-outline-danger" id="flag-button">Flag <i class="fas fa-flag"></i></button>
            </div>

            <div className="replies">
                { replies }
            </div>

        </div>
    );

}

export default Comments;