const searchInput = document.getElementById("search-input");
const searchForm = document.getElementById("movie-search");
const movieList = document.getElementById("movie-list");
const watchlistHtml = document.getElementById("watchlist");

searchForm.addEventListener("submit", e => {
    e.preventDefault();
    getMovie();
})

searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchForm.dispatchEvent(new Event("submit"));
    }
})

async function getMovie() {
    const searchedMovie = searchInput.value;
    const response = await fetch(`https://www.omdbapi.com/?apikey=662bc325&s=${searchedMovie}&type=movie&plot=full`);
    const data = await response.json();

    if (data.Response === "False") {
        document.getElementById("movie-list").innerHTML = "";
        document.getElementById("placeholder").style.display = "none";
        document.getElementById("not-available").style.display = "flex";
    } else {
        document.getElementById("movie-list").innerHTML = "";
        document.getElementById("placeholder").style.display = "none";
        document.getElementById("not-available").style.display = "none";
        for (let dataSearch of data.Search) {
            renderResult(dataSearch.imdbID);
        }
    }
}

movieList.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-watchlist")) {
        const movieId = e.target.dataset.id;
        addToWatchlist(movieId);
    } else if (e.target.classList.contains("remove-watchlist")) {
        const watchlist = JSON.parse(localStorage.getItem("watchlist"));
        const id = e.target.dataset.remove;
        const index = watchlist.indexOf(id);
        watchlist.splice(index, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
    getMovie();
})

function addToWatchlist(movieId) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
}

async function renderResult(dataId) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=662bc325&i=${dataId}`);
    const data = await response.json();
    let { Poster, Title, imdbRating, Year, Runtime, Genre, Plot, imdbID } = data;
    
    Title = Title === "N/A" ? "-" : Title;
    imdbRating = imdbRating === "N/A" ? "-" : imdbRating;
    Year = Year === "N/A" ? "-" : Year;
    Runtime = Runtime === "N/A" ? "-" : Runtime;
    Genre = Genre === "N/A" ? "-" : Genre;
    Plot = Plot === "N/A" ? "-" : Plot;
    
    const watchlist = JSON.parse(localStorage.getItem("watchlist"));
    let icon = ``;
    
    if (watchlist.includes(imdbID)) {
        icon += `<i class="fa-solid fa-minus remove-watchlist" data-id=${imdbID}></i>`
    } else {
        icon += `<i class="fa-solid fa-plus add-to-watchlist" data-id=${imdbID}></i>`
    }

    movieList.innerHTML += `
        <div class="movie">
            <img src="${Poster}" class="poster" alt="Poster not available">
            <div class="info">
                <div class="title">
                    <h2>${Title}</h2>
                    <p class="rating"><i class="fa-solid fa-star"></i>${imdbRating}</p>
                </div>
                <span>${Year}</span>
                <div class="details">
                    <p>${Runtime}</p>
                    <p>${Genre}</p>
                    <label class="add-to-watchlist" data-id=${imdbID}>${icon}Watchlist</label>
                </div>
                <p class="summary">${Plot}</p>
            </div>
        </div>
    `;
}