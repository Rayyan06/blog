import { useEffect, useState } from "react";

function Comments(props) {
    // Save a variable where we will store all the comments
    const [comments, setComments] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);

    const articleID = JSON.parse(document.querySelector("#article_id").textContent);

    useEffect(
        fetch(`api/comments/${articleID}`)
        .then(response=>{response.json()})
        .then(data=>{
            setComments(data);
            setIsLoading(false);
        })
    )
    return (
        <>
            {
                
                comments.map((comment)=>{
                        <div class='list-group-item'>
                            <div class="d-flex w-100 justify-content-between">
                                <small class="text-muted">
                                    { comment.date }
                                </small>
                            </div>
                            <p class="mb-1">{ comment.text }</p>
                            <small class='text-muted'>
                                by <strong>{ comment.user }</strong>
                            </small>
                        </div>
                        
                    }
                )
            }
        </>
    );
}

export default Comments;