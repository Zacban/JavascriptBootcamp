import { debounce, searchFetch } from "./utils.js";

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label><b>Search for a movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async event => {
    const movies = await searchFetch(event.target.value);

    if (!movies.length) {
        dropdown.classList.remove('is-active');
        return;
    }
    resultsWrapper.innerHTML = '';

    dropdown.classList.add('is-active');
    for (let movie of movies) {
        const option = document.createElement('a');
        option.classList.add('dropdown-item');
        option.innerHTML = `
        <img src="${movie.Poster}" />
        ${movie.Title}
        `;

        option.addEventListener('click', event => {
            input.value = movie.Title;
            dropdown.classList.remove('is-active');
            onMovieSelect(movie);
        });
        resultsWrapper.appendChild(option);
    }
};

input.addEventListener('input', debounce(onInput));
document.addEventListener('click', (event) => {
    console.log(event.target, root.contains(event.target));

    if (!root.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
});

const onMovieSelect = async movie => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '996f8dcc',
            i: movie.imdbID
        }
    });

    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    ${movieNotification(movieDetail.Awards, 'Awards')}
    ${movieNotification(movieDetail.BoxOffice, 'Box Office')}
    ${movieNotification(movieDetail.Metascore, 'Metascore')}
    ${movieNotification(movieDetail.imdbRating, 'IMDB Rating')}
    ${movieNotification(movieDetail.imdbVotes, 'IMDB votes')}
    `;
};

const movieNotification = (title, subtitle) => {
    return `
    <article class="notification is-primary">
        <p class="title">${title}</p>
        <p class="subtitle">${subtitle}</p>
    </article>
    `;
}