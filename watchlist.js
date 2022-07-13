function getWatchlist(){
    let html = ""
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(localStorage.getItem(key));
        fetch(`https://www.omdbapi.com/?apikey=7221b58b&i=${key}&r=json`)
            .then(res => res.json())
            .then(film => {
                html += `
                    <div class="film-info">
                        <div class="poster-section">
                            <img class="movie-poster" src="${film.Poster}" alt="film poster" onerror="this.src='images/no-poster.jpg'">
                        </div>
                        <div class="info">
                            <div class="section">
                                <h3 class="film-title">${film.Title}</h3>
                                <img class="star" src="images/ratings-icon.png" alt="star">
                                <p class="ratings">${film.Ratings[0].Value.substring(0, 3)}</p>
                            </div>
                            <div class="section">  
                                <p class="runtime">${film.Runtime}</p>
                                <p class="genre">${film.Genre}</p>
                                <button class="remove-btn" data-id="${film.imdbID}"><img src="images/remove-icon.png">Remove</button>
                            </div>
                            <div class="section">
                                <p class="plot">${film.Plot}</p>
                            </div>
                        </div>
                    </div>
                    <hr>`
                document.getElementById("saved-list").innerHTML = html;
            })
    }
    setTimeout(activateBtn,500)
}

getWatchlist();


function activateBtn() {
    const btns = document.querySelectorAll('.remove-btn');
    btns.forEach(btnClicked);
}

function btnClicked(btn) {
    btn.addEventListener('click',()=>{
        localStorage.removeItem(btn.getAttribute('data-id'))
        window.location.reload()
    });
}