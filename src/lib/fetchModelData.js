// lib/fetchModelData.js

const BASE_URL = 'http://localhost:8081';

function fetchModel(url) {
  return fetch(BASE_URL + url)
    .then((response) => {
      if (!response.ok) {
        // có thể đọc message từ backend
        return response.json().then((err) => {
          const msg = err && err.message ? err.message : 'Fetch error';
          throw new Error(msg);
        });
      }
      return response.json();
    })
    .catch((err) => {
      console.error('fetchModel error:', err);
      throw err;
    });
}

export default fetchModel;
