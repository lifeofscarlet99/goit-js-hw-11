import axios from 'axios';

export default async function addPicture(value, page) {
  const url = 'https://pixabay.com/api/';
  const key = '28050090 - e4120652e7844fcfe38f11ea6';
  const filter = `?key=${key}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(`${url}${filter}`).then(response => response.data);
}
