import React from 'react';
import ReactDOM from "react-dom";
import Comments from "./javascript/components/comments.js";
import LikesElement from "./javascript/components/likeshare.js";


// bootstrap stuff
import '/bootstrap/js/dist/tooltip';
import '/bootstrap/js/dist/button';
import '/bootstrap/js/dist/dropdown';
import '/bootstrap/js/dist/collapse';



ReactDOM.render(
  <Comments />,
  document.getElementById('comments')
);

ReactDOM.render(
    <LikesElement />,
    document.getElementById('likeshare')
)