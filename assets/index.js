import React from 'react';
import ReactDOM from "react-dom";
import Comments from "./javascript/components/comments.js";
import LikesElement from "./javascript/components/likeshare.js";

ReactDOM.render(
  <Comments />,
  document.getElementById('comments')
);

ReactDOM.render(
    <LikesElement />,
    document.getElementById('likeshare')
)