const API_KEY = 'd87f5999-8e99-4688-acb9-e260ad39cbbe',
      URL = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1',
      APU_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=',
      API_URL_MOVIE = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';


getMovies(URL);

async function getMovies(url) {
   const response = await fetch(url, {
    headers : {
      "Content-type" : 'application/json',
      'X-API-KEY' : API_KEY,
    },
   });
   const data = await response.json();
   showMovies(data);
}

function getColorByRating(rating) {
  if (rating > 7) {
    return 'green'
  } else if (rating > 5) {
    return 'orange'
  } else {
    return 'red'
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");
  
  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
      <div class="movie">
        <div class="movie__cover-inner">
          <img src="${movie.posterUrlPreview}" class="movie__cover" alt='${movie.nameRu}'>
          <div class="movie__cover--darkened"></div>
        </div>
        <div class="movie__info">
          <div class="movie__title">${movie.nameRu}</div>
          <div class="movie__category">${movie.genres.map((genre) => ` ${genre.genre}`)}</div>
          <div class="movie__average movie__average--${getColorByRating(movie.rating)}">${movie.rating}</div>
        </div>
      </div>
      `
      movieEl.addEventListener('click', () => openModal(movie.filmId))
      moviesEl.appendChild(movieEl);
  });
  
}


const form = document.querySelector('form'),
      search = document.querySelector('.header__search')

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const apiSearchUrl = `${APU_URL_SEARCH}${search.value}`
  if (search.value) {
    getMovies(apiSearchUrl)
    search.value = '';
  }
})

//modal
const modalEl = document.querySelector('.modal');
async function openModal(id) {
  const response = await fetch(API_URL_MOVIE + id, {
    headers : {
      "Content-type" : 'application/json',
      'X-API-KEY' : API_KEY,
    },
   });
   const data = await response.json();
  modalEl.classList.add("modal--show"); 
  document.body.classList.add('stop-scrolling');
  modalEl.innerHTML = `
    <div class="modal__card">
    <img class="modal__movie-backdrop" src="${data.posterUrlPreview}" alt="">
    <h2>
      <span class="modal__movie-title">${data.nameRu}</span>
      <span class="modal__movie-release-year">${data.year}</span>
    </h2>
    <ul class="modal__movie-info">
      <div class="loader"></div>
      <li class="modal__movie-genre">Жанр: ${data.genres.map(el => `<span>${el.genre}</span>`)}</li>
${data.filmLength ? `<li class="modal__movie-runtime">Время - ${data.filmLength} минут</li>` : '' }
      <li >Сайт: <a class="modal__movie-site" href="${data.webUrl}">${data.webUrl}</a></li>
      <li class="modal__movie-overview">${data.description}</li>
    </ul>
    <button type="button" class="modal__button-close">Закрыть</button>
    </div>
  `
  
  const btnClose = document.querySelector('.modal__button-close');
  btnClose.addEventListener('click', () => closeModal())
}

function closeModal() {
  modalEl.classList.remove('modal--show');
  document.body.classList.remove('stop-scrolling');
}

window.addEventListener('click', (event) => {
  if (event.target === modalEl) {
    closeModal();
  }
})

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})