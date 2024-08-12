document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('#movieContainer');
    let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
    const homeLogo= document.getElementById('homeLogo');
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTBlZmI3ODcxNTQ5NjZhODI3NTI4MzllNzg3Nzk4MCIsIm5iZiI6MTcyMjg0NjcwMi40NjY4NTEsInN1YiI6IjY1YjkzZjM0OTBmY2EzMDE3YjA3MjJhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QVGlmKVWS6bhzwpsqWsBsK6JWsXm9aZmsUoUYIZMrkw'
        }
    };

    homeLogo.addEventListener('click',()=>{
      window.location.href="index.html";
    })
    

    function printLikedMovies(movie) {
        const card = document.createElement('div');
        card.classList.add('card');

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('img');
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        imgDiv.appendChild(img);
        card.appendChild(imgDiv);

        const description = document.createElement('div');
        description.classList.add('description');

        const titleDateDiv = document.createElement('div');
        titleDateDiv.classList.add('titleDate');
        const title = document.createElement('h3');
        title.textContent = movie.title;

        const date = document.createElement('p');
        const releaseDate = new Date(movie.release_date);
        date.textContent = releaseDate.getFullYear();

        titleDateDiv.appendChild(title);
        titleDateDiv.appendChild(date);
        description.appendChild(titleDateDiv);

        const overview = document.createElement('div');
        overview.classList.add('overview');
        const overviewText = document.createElement('p');
        overviewText.textContent = movie.overview;
        overview.appendChild(overviewText);
        description.appendChild(overview);

        card.appendChild(description);
        cardContainer.appendChild(card);


        card.addEventListener('click', ()=>{
            localStorage.setItem('click-movie-id', movie.id);
            window.location.href="movie.html";
        })
    }

    function getMovieDetails() {
        favoriteMovies.forEach(movieID => {
            fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options)
                .then(response => response.json())
                .then(response => {
                    console.log(response);
                    printLikedMovies(response); // 'response.results' yerine 'response' kullanılmalı
                })
                .catch(err => console.error(err));
        });
    }

    getMovieDetails();
});
