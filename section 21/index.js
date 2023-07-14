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
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');

        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('https://www.omdbapi.com/', {
        params: {
            apikey: '996f8dcc',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);
    switch (side) {
        case 'left':
            leftMovie = response.data;
            break;
        case 'right':
        default:
            rightMovie = response.data;
            break;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    var leftSideStats = document.querySelectorAll('#left-summary .notification');
    var rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        var rightStat = rightSideStats[index];

        var leftValue = parseInt(leftStat.dataset.value);
        var rightValue = parseInt(rightStat.dataset.value);
        
        if (leftValue > rightValue) {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
        else {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        }
    })
}

const movieTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))

    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value))
            return prev;

        return prev + value;
    }, 0);

    console.log(dollars, metascore, imdbRating, imdbVotes, awards);

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
    ${movieNotification(movieDetail.Awards, 'Awards', awards)}
    ${movieNotification(movieDetail.BoxOffice, 'Box Office', dollars)}
    ${movieNotification(movieDetail.Metascore, 'Metascore', metascore)}
    ${movieNotification(movieDetail.imdbRating, 'IMDB Rating', imdbRating)}
    ${movieNotification(movieDetail.imdbVotes, 'IMDB votes', imdbVotes)}
    `;
};

const movieNotification = (title, subtitle, dataValue) => {
    return `
    <article class="notification is-primary" data-value="${dataValue}">
        <p class="title">${title}</p>
        <p class="subtitle">${subtitle}</p>
    </article>
    `;
}