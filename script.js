const resultsNav = document.getElementById('resultssNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const API_KEY = 'jKc7MFIHk0lNWyzxOpBf95TVPJ4BblfxVzwyDzYk';
const COUNT = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=jKc7MFIHk0lNWyzxOpBf95TVPJ4BblfxVzwyDzYk&count=${COUNT}`;

let resultsArray = [];
let favorites = {};

const updateDOM = (page) => {
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

const createDOMNodes = (page) => {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    console.log(currentArray, page)
    currentArray.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('card');
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = "NASA Pictures of the Day";
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = "Add to Favorites";
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = "Remove Favorite";
            saveText.setAttribute('onclick', `deleteFavorite('${result.url}')`);
        }
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        const footer = document.createElement('p');
        footer.classList.add('text-muted');
        const date = document.createElement('strong');
        date.textContent = result.date;
        const copyrightResult = result.copyright === undefined ? '' : result.copyright; 
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        footer.append(date, copyright);
        cardBody.append(cardTitle, cardText, saveText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}
const getNasaPictures = async() => {
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch(error) {
        
    }
}

const showContent = (page) => {
    window.scrollTo({top: 0, behavior: 'instant'});
    if (page === "results") {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

const saveFavorite = (itemUrl) => {
    resultsArray.forEach(item => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl] ) {
            favorites[itemUrl] = item;
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites))
        }
    })
}

const deleteFavorite = (itemUrl) => {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaPictures();
