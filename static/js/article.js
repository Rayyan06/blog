let liked = false;

function like(button) {
    const article = button.dataset.article;

    fetch(`article/${article}/like`, {
        method: 'PUT',
        body: JSON.stringify({
            liked: true;
        })
        
    })
}

document.addEventListener('DOMContentLoaded', ()=>{
    const button = document.querySelector('#like-button')
    button.onclick = () => {
       like(this);
    }
})