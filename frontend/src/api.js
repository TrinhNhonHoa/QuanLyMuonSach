import axios from 'axios';

// Thiết lập baseURL để dễ dàng sử dụng lại
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Đảm bảo đúng đường dẫn API
  timeout: 5000, // Thời gian chờ tối đa (5 giây)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm lấy danh sách sách
export const getSach = async () => {
  try {
    const response = await api.get('/sach');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sách:', error);
    throw error;
  }
};

// Hàm lấy danh sách độc giả
export const getDocGia = async () => {
  try {
    const response = await api.get('/docgia');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách độc giả:', error);
    throw error;
  }
};

// Hàm mượn sách
export const muonSach = async (data) => {
  try {
    const response = await api.post('/muonsach', data);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi mượn sách:', error);
    throw error;
  }
};

// Hàm trả sách
export const traSach = async (id) => {
  try {
    const response = await api.put(`/trasach/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi trả sách:', error);
    throw error;
  }
};

export default api;
