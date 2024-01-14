const watchlistHtml = document.getElementById("watchlist");

function renderWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"));
    watchlistHtml.textContent = "";
    
    for (const movieId of watchlist) {
        fetch(`https://www.omdbapi.com/?apikey=662bc325&i=${movieId}`)
            .then(response => response.json())
            .then(data => {
                let { Poster, Title, imdbRating, Year, Runtime, Genre, Plot, imdbID } = data;
    
                watchlistHtml.innerHTML += `
                    <div class="movie">
                        <img src="${Poster}" class="poster" alt="Poster not available">
                        <div class="info">
                            <div class="title">
                                <h2>${Title}</h2>
                                <p class="rating"><i class="fa-solid fa-star"></i>&nbsp${imdbRating}</p>
                            </div>
                            <span>${Year}</span>
                            <div class="details">
                                <p>${Runtime}</p>
                                <p>${Genre}</p>
                                <label class="remove-watchlist" data-remove=${imdbID}><i class="fa-solid fa-minus remove-watchlist" data-remove=${imdbID}></i>Watchlist</label>
                            </div>
                            <p class="summary">${Plot}</p>
                        </div>
                    </div>
                `;
            })
    }
}

watchlistHtml.addEventListener("click", e => {
    if (e.target.classList.contains("remove-watchlist")) {
        const watchlist = JSON.parse(localStorage.getItem("watchlist"));
        const id = e.target.dataset.remove;
        const index = watchlist.indexOf(id);
        watchlist.splice(index, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        renderWatchlist();
    }
})

renderWatchlist();