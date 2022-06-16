import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '27937043-64f9c887e86f29b7abf52345b';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.querySelector('.search-form');
const input = document.querySelector('input[name="searchQuery"]');
const container = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let currentPage = 0;
let searchQuery = '';
let totalImages = 0;

let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });

form.addEventListener('submit', onImageSearch);
loadMore.addEventListener('click', onLoadBtn);

async function onImageSearch(e) {
  try {
    e.preventDefault();
    container.innerHTML = '';
    loadMore.classList.add('hidden');
    currentPage = 1;
    totalImages = 0;
    searchQuery = input.value;
    if (searchQuery === '') {
      return;
    }

    const addImage = await fetchImg(searchQuery);
    await pageMarkup(addImage);
    await queryMain(addImage);
  } catch {
    error => console.log(error);
  }
}
async function onLoadBtn() {
  try {
    currentPage += 1;
    const addImage = await fetchImg(searchQuery);
    await pageMarkup(addImage);
  } catch {
    error => console.log(error);
  }
}

function pageMarkup(e) {
  totalImages += e.hits.length;
  if (e.total === 0) {
    undefinedSearch();
  } else if (e.total <= totalImages) {
    imageMarkup(e);
    setTimeout(endOfImages, 3000);
    loadMore.classList.add('hidden');
  } else {
    loadMore.classList.remove('hidden');
    imageMarkup(e);
  }
}

function imageMarkup(e) {
  const markup = e.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="photo-card" href="${largeImageURL}">
    <img class="image-item" src="${webformatURL}" alt="${tags}" data-source="${largeImageURL}"loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes:</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views:</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments:</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads:</b> ${downloads}
      </p>
    </div>
    </a>`;
      }
    )
    .join('');
  container.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

async function fetchImg(query) {
  try {
    const params = new URLSearchParams({
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });
    const url = `${BASE_URL}?key=${API_KEY}&q=${query}&${params}&page=${currentPage}`;

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function undefinedSearch() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      timeout: 1000,
      width: '300px',
    }
  );
}

function queryMain(e) {
  if (e.totalHits > 0) {
    Notify.info(` We have found for you ${e.totalHits} images! `, {
      timeout: 1000,
      width: '300px',
    });
  }
}
function endOfImages() {
  Notify.info("We're sorry, but you've reached the end of search results.", {
    timeout: 1000,
    width: '300px',
  });
}
