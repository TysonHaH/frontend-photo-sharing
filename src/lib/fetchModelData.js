const BASE_URL = "https://2khqwf-8081.csb.app";

function request(url, method, data = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  const config = {
    method: method,
    headers: headers,
    credentials: "include", // Quan trọng: Cho phép gửi cookie session đi kèm
  };

  // Nếu có body và method không phải là GET/HEAD, thêm body vào config
  if (data && method !== "GET" && method !== "HEAD") {
    config.body = JSON.stringify(data);
  }

  return fetch(BASE_URL + url, config)
    .then(async (response) => {
      // 1. Cố gắng lấy data JSON, nếu backend không trả JSON (ví dụ lỗi 500 html) thì gán là null hoặc object rỗng
      let responseData = null;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = null;
      }

      // 2. Xử lý trường hợp lỗi (Status không phải 2xx)
      if (!response.ok) {
        // Tạo object lỗi để ném ra catch
        const errorObj = new Error(responseData?.message || "Fetch error");
        errorObj.status = response.status; // <--- Gán thêm status vào lỗi để catch bắt được
        errorObj.data = responseData; // Gán thêm data lỗi nếu cần
        throw errorObj;
      }

      // 3. TRẢ VỀ CẢ DATA VÀ STATUS (Thành công)
      return {
        data: responseData, // Dữ liệu từ backend
        status: response.status, // Mã HTTP (200, 201...)
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
  return request(url, "GET");
}

// 2. POST (Tạo mới)
export function postModel(url, data) {
  return request(url, "POST", data);
}

// 3. PUT (Cập nhật)
export function putModel(url, data) {
  return request(url, "PUT", data);
}

// 4. DELETE (Xóa)
export function deleteModel(url) {
  return request(url, "DELETE");
}

export default fetchModel;
