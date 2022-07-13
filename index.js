// api key 7221b58b
const searchBar = document.getElementById("search-bar");
const searchBtn = document.getElementById("search-btn");
const filmContent = document.getElementById("content");
let searchBarValue;

// disable search button onload, on after user types
searchBtn.disabled = true;

function getSearchBarValue() {
    // remove whitespace before and after value
    searchBarValue = searchBar.value.trim()
    searchBtn.disabled = false;
}

// parameter s returns array of movies with 
// Poster, Title, Type, Year, imdbID only
// stored in searchResults 
async function search() {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=7221b58b&s=${searchBarValue}&r=json`);
        const data = await response.json();
        const searchResults = data.Search;
        getFilmHtml(searchResults);
        searchBar.value = ""; // clear search bar after clicking search
    } catch {
        filmContent.innerHTML = `
            <div class="no-results">
                <p>Unable to find what you're looking for. Please try another search.</p>
            </div>`
        searchBar.value = ""; // clear search bar after clicking search
    }
}

// HTML for film content section
function getFilmHtml(searchResults) {
    let html = ""
    for (film of searchResults) {
        const imdbID = film.imdbID
        searchByFilm(imdbID)
            .then(film => {
                const {title, poster, ratings, runtime, genre, imdbID,plot} = film
                html += `
                    <div class="film-info">
                        <div class="poster-section">
                            <img class="movie-poster" src="${poster}" alt="film poster" onerror="this.src='images/no-poster.jpg'">
                        </div>
                        <div class="info">
                            <div class="section">
                                <h3 class="film-title">${title}</h3>
                                <img class="star" src="images/ratings-icon.png" alt="star">
                                <p class="ratings">${ratings}</p>
                            </div>
                            <div class="section">  
                                <p class="runtime">${runtime}</p>
                                <p class="genre">${genre}</p>
                                <button class="add-btn" data-id="${imdbID}"><img src="images/add-icon.png">Watchlist</button>
                            </div>
                            <div class="section">
                                <p class="plot">${plot}</p>
                            </div>
                        </div>
                    </div>
                    <hr>`
                filmContent.innerHTML = html;
            })
    }
    setTimeout(activateBtn,500)
}

// use imdbID to get more details
async function searchByFilm(imdbID) {
    const res = await fetch(`https://www.omdbapi.com/?apikey=7221b58b&i=${imdbID}&r=json`);
    const movie = await res.json();
    // ratings in 0.0/10 format (take first 3 nums with substring)
    return {title: movie.Title,
            poster: movie.Poster, 
            ratings: movie.Ratings[0].Value.substring(0, 3), 
            runtime: movie.Runtime, 
            genre: movie.Genre, 
            imdbID: movie.imdbID, 
            plot: movie.Plot};
}

function activateBtn() {
    const btns = document.querySelectorAll('.add-btn');
    btns.forEach(btnClicked);
}

function btnClicked(btn) {
    btn.addEventListener('click',()=>{
        localStorage.setItem(btn.getAttribute('data-id'),btn.getAttribute('data-id'))
        btn.style.display = 'none'
    });
}

searchBar.addEventListener("keyup", getSearchBarValue)
searchBtn.addEventListener("click", search);