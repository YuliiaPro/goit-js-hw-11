import axios from 'axios';

import Notiflix from 'notiflix'; 

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39433955-728af2fbc7a9802d70eb7d223';

let page = 1;
let query = '';  
let totalHits = 0;

const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    loadMore: document.querySelector('.load-more'),
};


refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.style.display = 'none';



async function getPhotos(query, page) {
    try {
        const response = await axios
            .get(`${BASE_URL}?key=${API_KEY}`, {
                params: {
                    key: API_KEY,
                    q: query,              
                    image_type: 'photo',
                    orientation: 'horizontal',
                    safesearch: 'true',
                   page: page,
                   per_page: 40,
              },
            })
     // console.log(response);
      totalHits = response.data.total;
      //console.log(`totalHits for "${query}" : ${ totalHits }`);
      if ( page === 1) {
                Notiflix.Notify.success(
                    `Hooray! We found ${response.data.total} images.`
        );
      };
      createMarkup(response.data.hits);
    }
    catch (error) {
    console.log(error);
  }
}

function createMarkup(photos) {

    const photosGallery = photos.map(item =>
        `<div class="photo-card">
        <div class="photo">
        <a href="${item.largeImageURL}">
            <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" class="images"/>
        </a>
        </div>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${item.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${item.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${item.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${item.downloads}
      </p>
    </div>
  </div>`)
        .join(''); 
  
  refs.gallery.insertAdjacentHTML('beforeend', photosGallery);
  simpleLightBox.refresh();
}

 const simpleLightBox = new SimpleLightbox(".gallery a", {captionDelay: 250, captionPosition:"button"});
//console.log(simpleLightBox);



function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements["searchQuery"].value.trim();
  query = searchQuery;
  page = 1;
  totalHits = 0;
  refs.gallery.innerHTML = '';
  if (!searchQuery) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  getPhotos(query, page); 
}

//   Нескінченний скрол
window.addEventListener('scroll', () => {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    page +=1;
    getPhotos(query, page);
  }
})