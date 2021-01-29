import React from 'react';
import ReactDOM from "react-dom";
import Comments from "./components/comments.js";
import LikesElement from "./components/likeshare.js";

ReactDOM.render(
  <Comments />,
  document.getElementById('comments')
);

ReactDOM.render(
    <LikesElement />,
    document.getElementById('likeshare')
)