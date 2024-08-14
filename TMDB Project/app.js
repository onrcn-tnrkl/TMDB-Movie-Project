document.addEventListener('DOMContentLoaded',()=>{
    const cardContainer= document.querySelector("#movieContainer");
    const popular= document.getElementById("popular");
    const now_playing= document.getElementById("now-playing");
    const top_rated= document.getElementById("top-rated");
    const homeLogo= document.getElementById('homeLogo');
    homeLogo.addEventListener('click',()=>{
      window.location.href="index.html";
    })
    
    let keyword="";
    let searchBar= document.getElementById('searchBar');
    let isSearch= false;
    let currentPage= 1;
    let defaultEndpoint= 'now_playing';

    function renderMovie(movie){
        const card= document.createElement('div')
        card.classList.add('card');

        const imgDiv= document.createElement('div');
        imgDiv.classList.add('img');
        const img= document.createElement('img');
        img.src= `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        imgDiv.appendChild(img);
        card.appendChild(imgDiv);

        const descriptionDiv= document.createElement('div');
        descriptionDiv.classList.add('description');
        const title= document.createElement('p');
        title.classList.add('title');
        title.textContent= movie.title;
        const year= document.createElement('p');
        year.classList.add('year');
        const releaseDate= new Date(movie.release_date)
        year.textContent= releaseDate.getFullYear();
        descriptionDiv.appendChild(title);
        descriptionDiv.appendChild(year);
        card.appendChild(descriptionDiv);

        cardContainer.appendChild(card);


        card.addEventListener('click', ()=>{
            localStorage.setItem('click-movie-id', movie.id);
            window.location.href="movie.html";
        })

    }

    function setActiveButton(button){
        popular.classList.remove('active');
        now_playing.classList.remove('active');
        top_rated.classList.remove('active');

        popular.style.textShadow="none";
        now_playing.style.textShadow="none";
        top_rated.style.textShadow="none";

        button.classList.add('active')
        button.style.textShadow="0 4px 8px rgba(255, 255, 255, 0.5)";
    }
    
    popular.addEventListener('click',()=>{
        setActiveButton(popular);
        cardContainer.innerHTML="";
        const popularEndpoint="popular";
        isSearch=false;
        currentPage=1;
        loadMovieFromAPI(keyword, popularEndpoint, currentPage)
    });
    now_playing.addEventListener('click',()=>{
        setActiveButton(now_playing);
        cardContainer.innerHTML="";
        isSearch=false;
        currentPage=1;
        loadMovieFromAPI(keyword, defaultEndpoint, currentPage)
    })
    top_rated.addEventListener('click', ()=>{
        setActiveButton(top_rated);
        cardContainer.innerHTML="";
        isSearch=false;
        const top_rated_endpoint="top_rated";
        currentPage=1;
        loadMovieFromAPI(keyword, top_rated_endpoint, currentPage);
    })

    function getCurrentEndpoint() {
        if (popular.classList.contains('active')) return "popular";
        if (now_playing.classList.contains('active')) return "now_playing";
        if (top_rated.classList.contains('active')) return "top_rated";
        return defaultEndpoint;
    }

    function pagination(){
        const backBtn= document.getElementById('back');
        const nextBtn= document.getElementById('next');
        
        function updateButtons(){
            if (currentPage===1){
                backBtn.style.display="none";
            }
            else{
                backBtn.style.display="flex";
            }
        }
        updateButtons()

        nextBtn.addEventListener('click', () => {
            currentPage += 1;
            cardContainer.innerHTML="";
            loadMovieFromAPI(keyword, getCurrentEndpoint(),currentPage);
            updateButtons();
        });

        backBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage -= 1;
                cardContainer.innerHTML="";
                loadMovieFromAPI(keyword,getCurrentEndpoint(),currentPage);
                updateButtons();
            }
        });
    }
    pagination();
    

    function loadMovieFromAPI(keyword, endpoint, page){
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTBlZmI3ODcxNTQ5NjZhODI3NTI4MzllNzg3Nzk4MCIsIm5iZiI6MTcyMjc2NjQyMy4xMzkyMjUsInN1YiI6IjY1YjkzZjM0OTBmY2EzMDE3YjA3MjJhOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IU7Izh3JoJOlt5snlLXvsIvSvn8j372D9gZUx1giQhY'
            }
        };
          let url=""
          if(isSearch){
            url= new URL(`https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&`)
          }
          else{
            url= new URL(`https://api.themoviedb.org/3/movie/${endpoint}?language=en-US`)
          }
          url.searchParams.append('page',page);
          
          fetch(url, options)
            .then(response => response.json())
            .then(response => {
                response.results.forEach(movie => {
                    renderMovie(movie);
                });
            })
            .catch(err => console.error(err));
    }    
    const searchButton= document.getElementById('searchBtn');
    searchButton.addEventListener('click',()=>{
        isSearch=true;
        currentPage=1;
        keyword= searchBar.value;
        if(keyword){
            cardContainer.innerHTML="";
            loadMovieFromAPI(keyword, defaultEndpoint, currentPage);
        }
        else{
            alert('Metin kutusu boş olamaz');
        }
    })
    loadMovieFromAPI(keyword, defaultEndpoint, currentPage);

    
})