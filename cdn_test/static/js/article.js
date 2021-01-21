let liked = JSON.parse(document.querySelector("#is_liked").textContent);
const articleID = JSON.parse(document.querySelector("#article_id").textContent);


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


const like_button = document.querySelector('#like-button');
const like_icon = document.querySelector('#like-icon');
const like_text = document.querySelector('#like-text');
const likes_amount = document.querySelector('#likes');


const csrftoken = getCookie('csrftoken');


const liked_class = 'fas';
const unliked_class = 'far';


function doVisualEffects(){
    if (liked) {
        like_text.innerHTML = 'Dislike';
        like_icon.classList.remove(unliked_class);
        like_icon.classList.add(liked_class);

    } else {
        like_text.innerHTML = 'Like    ';
        like_icon.classList.remove(liked_class);
        like_icon.classList.add(unliked_class);


    }
}

doVisualEffects();



function like() {

    async function postLikes() {
        const response = await fetch(`/article/${articleID}/like`, {
            method: 'POST',
            body: JSON.stringify({
                liked: liked,
            }),
            headers: {
                'X-CSRFToken': csrftoken,
            }
        })
        jsonResponse = await response.json();
        return jsonResponse;
    }

    postLikes()
    .then(data=>{
        doVisualEffects();

        likes_amount.innerHTML = `${data.likes} Likes`;


    })



    liked = !liked;
}





like_button.onclick = like;




