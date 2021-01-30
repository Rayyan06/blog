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
    const [errors, setErrors] = useState({"text": ""});
    const [isValid, setIsValid] = useState(true);
    const [fetching, setFetching] = useState(false);


    if (text.length>200) {
        setIsValid(false);
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
            setText("");
        })
        .catch(error=>{
            console.log('Error' + error);
            window.alert(error);
            setErrors(error.text);
        })

    }


    const formClass = isValid ? "is-valid" : "is-invalid";
    return (
        <div className="container py-3">
            <div className="mb-3">
                <label htmlFor="comment-text" className="form-label">Text</label>
                <textarea id="comment-text" placeholder="Comment Text" className={"form-control " + formClass} value={text} rows="5" onChange={(event)=>setText(event.target.value)} required/>


                 <div className="invalid-feedback">{`Your comment is longer than 200 characters. It is ${text.length} characters.`}</div>
                 <div className="valid-feedback">{`${text.length} Characters`}</div>


            </div>
            <div className="mb-3">
                {user_is_authenticated ?
                    <button className="btn btn-outline-primary" type="button" onClick={() => saveComment()} disabled={(!text)|fetching|(text>200)}>{fetching ? "Commenting...": "Comment"}</button>
                :   <span className="d-inline-block" tabindex="0" data-toggle="tooltip" title="You must be authenticated to comment">
                        <button className="btn btn-outline-primary" id="save-comment" type="button" onClick={() => saveComment()} disabled>Sign in to comment</button>
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
                {props.comments.map((comment)=>
                    <div className='list-group-item'>
                        <div className="d-flex w-100 justify-content-between">
                            <small className="text-muted">
                                Date: { comment.date }
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

    } else {
        return <></>
    }
}


export default Comments;