import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const container = document.querySelector('div');
const searchInput = document.querySelector('input');

function showLoader() {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  gallery.parentNode.insertBefore(loader, gallery);
}

function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (searchInput.value.trim() === '') {
    iziToast.error({
      message: 'Your request is missing. Please fill out the form',
      position: 'topCenter',
    });
    return;
  }

  gallery.innerHTML = '';

  showLoader();

  const searchTerm = searchInput.value;
  searchImages(searchTerm);
  searchInput.value = '';
});

function searchImages(searchTerm) {
  const apiKey = '42356211-e192fc2ea90e5ac732e43fabf';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchTerm}&image_type=photo&orientation=horizontal&safesearch=true`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch images from the server');
      }
      return response.json();
    })
    .then(data => displayImages(data))
    .catch(error => {
      iziToast.error({
        message: `An error occurred: ${error.message}`,
        position: 'topCenter',
      });
    })
    .finally(() => hideLoader());
}

function displayImages(data) {
  if (data.hits.length === 0) {
    iziToast.error({
      message:
        'Sorry, there are no images matching your search query. Please try again!',
      position: 'topCenter',
    });
  } else {
    const markup = data.hits
      .map(image => {
        return `
  <li class="gallery-item">
    <a href="${image.largeImageURL}">
      <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}">
    </a>
    <p><b>Likes: </b>${image.likes}</p>
    <p><b>Views: </b>${image.views}</p>
    <p><b>Comments: </b>${image.comments}</p>
    <p><b>Downloads: </b>${image.downloads}</p>
  </li>`;
      })
      .join('');

    gallery.insertAdjacentHTML('beforeend', markup);

    const lightbox = new SimpleLightbox('.gallery a', {
      captions: true,
      captionType: 'attr',
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionSelector: 'img',
      captionDelay: 250,
    });

    lightbox.refresh(); // Оновлення лайтбоксу після вставлення нових елементів
  }
}
