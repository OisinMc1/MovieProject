const baseURL = 'http://image.tmdb.org/t/p/'

function getRecomendations (item) {
  const url = `https://api.themoviedb.org/3/movie/${item.id}/recommendations?api_key=${APIKEY}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      let items = res.results
      var recommendations = document.getElementById('recommendations')

      for (var i = 0; i < items.length; i++) {
        let item = items[i]
        let tmpl = document.getElementById('recomendationsTemplate')
        tmpl.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w154/${item.poster_path}` : 'https://via.placeholder.com/154x239.png?text=NO+IMAGE'
        tmpl.querySelector('.movie-title').innerText = item.original_title
        tmpl.querySelector('.item').onclick = setMovie.bind(event, item)
      }
    })
}

function search (page) {
  let searchInput = document.getElementById('searchInput').value

  if (!searchInput) {
    setTitle()
    setMoviesTable(mostPopularMovies)
    return
  }

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&page=${page}&query=${searchInput}`

  fetch(url)
    .then(data => {
      return data.json()
    })
    .then(res => {
      setMoviesTable(res.results)
    })
}

function setBannerImage (res) {
  let randomItem = res[Math.floor(Math.random() * 20 + 1)]
  let header = document.getElementById('header')
  header.style.background = randomItem ? `linear-gradient(rgba(0, 0, 0, 0.6),rgba(0, 0, 0, 0.6)), url(${baseURL}original/${randomItem.backdrop_path}) no-repeat top` : '#78909C'
  header.style.backgroundSize = 'cover'
}

function setMoviesTable (items) {
  clearMoviesTable()
  var moviesTable = document.getElementById('moviesTable')

  for (var i = 0; i < items.length; i++) {
    let item = items[i]
    let tmpl = document.getElementById('movieListTemplate').content.cloneNode(true)
    tmpl.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w45/${item.poster_path}` : 'https://via.placeholder.com/45x68.png?text=NO+IMAGE'
    tmpl.querySelector('.movie-title').innerText = item.original_title
    tmpl.querySelector('.movie-release-year').innerText = item.release_date.slice(0, 4)
    tmpl.querySelector('.item').onclick = setMovie.bind(event, item)
    moviesTable.appendChild(tmpl)
  }
}

function setMovie (item) {
  clearMoviesTable()
  clearTitle()
  clearMovie()
  clearRecommendation()

  getRecomendations(item)

  var movie = document.getElementById('movie')
  var tmpl = document.getElementById('movieTemplate').content.cloneNode(true)
  tmpl.querySelector('.title').innerText = item.original_title
  tmpl.querySelector('.movie-release-year').innerText = item.release_date.slice(0, 4)
  tmpl.querySelector('.movie-poster').src = item.poster_path ? `${baseURL}w342/${item.poster_path}` : 'https://via.placeholder.com/342x513.png?text=NO+IMAGE'
  tmpl.querySelector('.overview').innerText = item.overview
  movie.appendChild(tmpl)
}

function setTitle () {
  var title = document.getElementById('title')
  var tmpl = document.getElementById('titleTemplate')
  alert("Please Enter Valis Movie Title");
}

function clearMoviesTable () {
  moviesTable.innerHTML = ''
}

function clearTitle () {
  title.innerHTML = ''
}

function clearMovie () {
  movie.innerHTML = ''
}

function clearRecommendation () {
  recommendations.innerHTML = ''
}

window.onload = function() {
  getTrendingList()

  // Execute a Search function when the user presses Enter key
  let searchInput = document.getElementById("searchInput")

  searchInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
      search()
    }

    if (!searchInput.value) {
      clearRecommendation()
      clearTitle()
      clearMovie()

      setTitle()
      setMoviesTable(mostPopularMovies)
    }
  })

  searchInput.focus()
}
