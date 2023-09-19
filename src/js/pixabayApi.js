import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39433955-728af2fbc7a9802d70eb7d223';


export async function getPhotos(query, page) {

  return await axios
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
    });
}
