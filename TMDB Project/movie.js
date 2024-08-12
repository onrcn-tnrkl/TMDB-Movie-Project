document.addEventListener('DOMContentLoaded', ()=>{
    const clickID= localStorage.getItem('click-movie-id');
    const homeLogo= document.getElementById('homeLogo');
    const likeBtn= document.getElementById('likeAnchor');
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
    
    
    function createPage(movie){
      const page_title= document.getElementById('movie_name')
      page_title.textContent=movie.title;
      //poster 
      const posterDiv= document.querySelector('.poster');
      const poster= document.createElement('img');
      poster.src= `https://image.tmdb.org/t/p/w500${movie.poster_path}`; 
      poster.alt=movie.title
      posterDiv.appendChild(poster);

      const titleGenreDate= document.querySelector('.title-genre-date');
      const title= document.createElement('h1');
      title.classList.add('title');
      title.textContent= movie.title;
      titleGenreDate.appendChild(title);
      const dateGenre= document.createElement('p');
      dateGenre.classList.add('date-genre');
      let genre= [];
      movie.genres.forEach(g => {
        genre.push(g.name);
      });
      dateGenre.textContent= `${movie.release_date} * ${genre}`;
      titleGenreDate.appendChild(dateGenre);

      if(JSON.parse(localStorage.getItem('favoriteMovies')).includes(clickID)){
        likeBtn.innerHTML=`<i class="fa-solid fa-heart"></i>`
      }
      else{
        likeBtn.innerHTML=`<i class="fa-regular fa-heart"></i>`
      }
      const tmdb= document.querySelector('.tmdb-rate');
      const tmdbRate= document.createElement('p');
      tmdbRate.innerHTML=`<i class="fa-solid fa-star" style="color: yellow;"></i> ${movie.vote_average.toFixed(1)}`;
      tmdb.appendChild(tmdbRate);

      const imdbIcon = document.getElementById('imdbIcon');
      imdbIcon.href = `https://www.imdb.com/title/${movie.imdb_id}`;


      const overview= document.querySelector('.overview');
      overview.textContent=movie.overview;

      const companies = document.querySelector('#companies');

      movie.production_companies.forEach(pc => {
          if (pc.logo_path) { // `if (pc.logo_path)` koşulu, logo_path varsa çalışır
              const cp_logo = document.createElement('li');
              cp_logo.classList.add('companies-item');
              const cp_logo_img = document.createElement('img');
              cp_logo_img.src = `https://image.tmdb.org/t/p/w500${pc.logo_path}`;
              cp_logo.appendChild(cp_logo_img);
              companies.appendChild(cp_logo); // Burada appendChild çağrısını if bloğunun içinde yapıyoruz
          }
          else{
            const cp_logo = document.createElement('li');
            cp_logo.classList.add('companies-item');
            const cp_title= document.createElement('h1');
            cp_title.textContent=pc.name;
            cp_logo.appendChild(cp_title);
            companies.appendChild(cp_logo)
          }
      });


    }

    const imgContainer= document.querySelector('.gallery');
    function printImg(img){
      const imgDiv= document.createElement('div');
      imgDiv.classList.add('column');
      const movieImg= document.createElement('img');
      movieImg.classList.add('movieImg');
      movieImg.src= `https://image.tmdb.org/t/p/w500${img}`;
      movieImg.style.width="100%";
      imgDiv.appendChild(movieImg);
      imgContainer.appendChild(imgDiv);
    }

    function trailer(video) {
      const watchTrailer = document.querySelector('.watch-trailer');
      watchTrailer.textContent="Watch Trailer";
      watchTrailer.addEventListener('click',()=>{
        const youtubeURL= `https://www.youtube.com/watch?v=${video.key}`
        window.location.href=youtubeURL;
      })

    }

    // Fetch trailer data
    function getTrailer(movieId) {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, options)
            .then(response => response.json())
            .then(response => {
                response.results.forEach(trailerData => {
                    if (trailerData.type === "Trailer" && trailerData.name.includes('Trailer')) {
                        trailer(trailerData);
                    }
                });
            })
            .catch(err => console.error(err));
      }
      getTrailer(clickID);

    function getImages(movieId){
      const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTBlZmI3ODcxNTQ5NjZhODI3NTI4MzllNzg3Nzk4MCIsIm5iZiI6MTcyMjg0NjcwMi40NjY4NTEsInN1YiI6IjY1YjkzZjM0OTBmY2EzMDE3YjA3MjJhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QVGlmKVWS6bhzwpsqWsBsK6JWsXm9aZmsUoUYIZMrkw'
        }
        };

        fetch(`https://api.themoviedb.org/3/movie/${movieId}/images`, options)
        .then(response => response.json())
        .then(response => {
            const firstTenImages = response.backdrops.slice(0, 12); // İlk 10 resmi al
            firstTenImages.forEach(img => {
                    printImg(img.file_path);
            })
        })
        .catch(err => console.error(err));
    }
    getImages(clickID);
        

    function dS(directScreen) {
      if (directScreen) {
        if (directScreen.director) {
          const directorName = document.querySelector('.director-name');
          directorName.textContent = directScreen.director;
        } else {
          const directorDiv = document.getElementById('director');
          directorDiv.style.display = "none";
        }
    
        if (directScreen.screenplay && directScreen.screenplay.length > 0) {
          const screenplayName = document.querySelector('.screenplay-name');
          screenplayName.textContent = directScreen.screenplay.join(', ');
        } else {
          const screenplayDiv = document.getElementById("screenplay");
          screenplayDiv.style.display = "none";
        }
      } else {
        document.getElementById('directScreenplay').style.display = "none";
      }
    }

    function getDirectorScreenplay(movieId){
      
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
        .then(response => response.json())
        .then(response => {
          const directorScreenplay= {};
          directorScreenplay.screenplay= [];
          response.crew.forEach(movie => {
            if (movie.job === 'Director') {
              directorScreenplay.director = movie.name;
            } else if (movie.job === 'Screenplay') {
              directorScreenplay.screenplay.push(movie.name);
            }
          });
          dS(directorScreenplay);
        })
        .catch(err => console.error(err));
    
    }
    getDirectorScreenplay(clickID);

    function getMovieDetails(movieID){
          
          fetch(`https://api.themoviedb.org/3/movie/${movieID}?language=en-US`, options)
            .then(response => response.json())
            .then(response => {
              createPage(response);
            })
            .catch(err => console.error(err));
    }
    getMovieDetails(clickID);

    function printCast(castData){
      const castContainer= document.querySelector('#castContainer');

      castData.forEach(cast => {
        if(cast.profile_path){
          const castCard= document.createElement('div');
          castCard.classList.add('cast-card');
          const castImgDiv= document.createElement('div');
          castImgDiv.classList.add('castImgDiv');
          const castImg= document.createElement('img');
          castImg.src=`https://image.tmdb.org/t/p/w500${cast.profile_path}` ;
          castImgDiv.appendChild(castImg);
          castCard.appendChild(castImgDiv);
          const castDescriptionDiv= document.createElement('div');
          castDescriptionDiv.classList.add('desDiv');
          const actorName= document.createElement('h2');
          actorName.textContent=cast.name;
          castDescriptionDiv.appendChild(actorName);
          const character= document.createElement('p');
          character.textContent=cast.character;
          castDescriptionDiv.appendChild(character);
          castCard.appendChild(castDescriptionDiv);
          
          castContainer.appendChild(castCard);
        }
        
        
      });
    }

    function getCast(movieId){

      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`, options)
        .then(response => response.json())
        .then(response => {
          printCast(response.cast)
        })
        .catch(err => console.error(err)); 
    }
    getCast(clickID);


    function getFavoriteMovies() {
      const favoritesString = localStorage.getItem('favoriteMovies');
      return JSON.parse(favoritesString) || [];
  }

  // Sayfada yeni bir film beğenildiğinde çağrılacak fonksiyon
  function addMovieToFavorites(movieId) {
      if (movieId) {
          let favorites = getFavoriteMovies();
          if (!favorites.includes(movieId)) {
              favorites.push(movieId);
              localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
          }
          else{
            console.log('this movie already exist!')
          }
          console.log(localStorage.getItem('favoriteMovies'))
      }
  }
  // Butona tıklanma olayını dinleyin
  likeBtn.addEventListener('click', function() {
    const clickMovie= JSON.parse(localStorage.getItem('favoriteMovies'));
    if(!clickMovie.includes(clickID)){
      likeBtn.innerHTML=`<i class="fa-solid fa-heart"></i>`
      addMovieToFavorites(clickID);
    }
    else{
      clickMovie.pop(clickID);
      localStorage.setItem('favoriteMovies', JSON.stringify(clickMovie));
      likeBtn.innerHTML=`<i class="fa-regular fa-heart"></i>`;
    }
      
  });

  /*
  */
  
})
