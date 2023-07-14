//import { debounce, searchFetch } from "./utils.js";
import { createAutoComplete } from "./autocomplete.js";

const autocompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
        <img src="${movie.Poster}" />
        ${movie.Title} (${movie.Year})
        `;
    },
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie);
    },
    inputValue(movie) {
        return movie.Title
    },
    async fetchData(searchTerm) {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                apikey: '996f8dcc',
                s: searchTerm
            }
        });

        if (response.data.Error)
            return [];

        return response.data.Search;
    }
}

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
});

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
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