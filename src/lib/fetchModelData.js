const BASE_URL = 'http://localhost:8081';

function request(url, method, data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const config = {
    method: method,
    headers: headers,
    credentials: 'include'
  };

  if (data && method !== 'GET' && method !== 'HEAD') {
    config.body = JSON.stringify(data);
  }

  return fetch(BASE_URL + url, config)
    .then(async (response) => {
      let responseData = null;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = null;
      }

      if (!response.ok) {
        const errorObj = new Error(responseData?.message || 'Fetch error');
        errorObj.status = response.status;
        errorObj.data = responseData; 
        throw errorObj;
      }
      return {
        data: responseData,   // Dữ liệu từ backend
        status: response.status // Mã HTTP (200, 201...)
      };
    })
    .catch((err) => {
      console.error(`Fetch ${method} error:`, err);
      throw err;
    });
}

// --- Các hàm Export để sử dụng bên ngoài ---

// 1. GET (Giữ lại logic cũ của bạn nhưng gọi hàm request)
export function fetchModel(url) {
  return request(url, 'GET');
}

// 2. POST (Tạo mới)
export function postModel(url, data) {
  return request(url, 'POST', data);
}

// 3. PUT (Cập nhật)
export function patchModel(url, data) {
  return request(url, 'PATCH', data);
}

// 4. DELETE (Xóa)
export function deleteModel(url) {
  return request(url, 'DELETE');
}

export default fetchModel;