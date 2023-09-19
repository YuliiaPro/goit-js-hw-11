import { getPhotos } from "./js/pixabayApi";

import refs from "./js/refs";
import galerryCard from "./templates/gallery-card.hbs"
import Notiflix, { Loading } from 'notiflix'; 

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.style.display = 'none';


const observer = new IntersectionObserver((entries, observer) => {
    
    console.log(entries);
    if (entries[0].isIntersecting) {
        loadMoreData();
    }
}, {
    root: null,
    rootMargin: "600px",
    threshold: 1,
})

 let page = 1;
 let query = '';

async function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements["searchQuery"].value.trim();
  if (!searchQuery) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  
  page = 1;
  query = searchQuery;

  try {
    const response = await getPhotos(query, page);
   
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`);
   
    refs.gallery.innerHTML = galerryCard(response.data.hits);
    simpleLightBox.refresh();
    
    if (Math.round(response.data.totalHits / 40) <= 1) {
      return
    }
    observer.observe(document.querySelector('.target-element'));

  } catch (error) {
    console.log(error);
  }
}

async function loadMoreData(e) {
  page += 1;

try {
  const data = await getPhotos(query, page);
  if (page === Math.ceil(data.data.totalHits / 40)) {
      observer.unobserve(document.querySelector('.target-element'));
    }
    refs.gallery.insertAdjacentHTML('beforeend', galerryCard(data.data.hits));
    simpleLightBox.refresh();
} catch (error) {
  console.log(error);
}
}

const simpleLightBox  = new SimpleLightbox(".gallery a", { captionDelay: 250, captionPosition: "button" });
