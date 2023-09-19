import { getPhotos } from "./js/pixabayApi";

import refs from "./js/refs";
import galerryCard from "./templates/gallery-card.hbs"
import Notiflix from 'notiflix'; 

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMore.style.display = 'none';


const observer = new IntersectionObserver((entries, observer) => {
    
    //console.log(entries);
    if (entries[0].isIntersecting) {
        loadMoreData();
    }
}, {
    root: null,
    rootMargin: "600px",
    threshold: 1,
})



function onSubmit(e) {
  e.preventDefault();
  const searchQuery = e.currentTarget.elements["searchQuery"].value.trim();
  if (!searchQuery) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  
  const query = searchQuery;
  const page = 1;
  

  getPhotos(query, page).then((resp) => {

Notiflix.Notify.success(
  `Hooray! We found ${resp.data.totalHits} images.`);
   
    refs.gallery.innerHTML = galerryCard(resp.data.hits);
    simpleLightBox.refresh();
    
    if (resp.data.totalHits === 1) {
      return 
      }
      observer.observe(document.querySelector('.target-element'));  
   }).catch(err => console.log(err)) 
}

function loadMoreData(e) {
  page += 1;
  getPhotos(query, page).then(res => {
        if (page === res.data.totalHits) {
            observer.unobserve(document.querySelector('.target-element'));
        }
    refs.gallery.insertAdjacentHTML('beforeend', galerryCard(res.data.hits));
    simpleLightBox.refresh();
    }).catch((err) => console.log(err))
}

const simpleLightBox  = new SimpleLightbox(".gallery a", { captionDelay: 250, captionPosition: "button" });

