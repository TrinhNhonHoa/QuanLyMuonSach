<template>
    <div v-if="isOpen" class="popup-overlay">
      <div class="popup-content">
        <h2>Tìm Kiếm Sách</h2>
        <form @submit.prevent="searchSach">
          <label>Mã Sách:</label>
          <input v-model="maSach" type="text" required />
          
          <div class="button-group">
            <button type="submit" class="btn-primary">Tìm</button>
            <button type="button" class="btn-secondary" @click="$emit('close')">Hủy</button>
          </div>
        </form>
        
        <div v-if="sach">
  <h3>Kết Quả:</h3>
  <p><strong>Mã Sách:</strong> {{ sach.MaSach || 'Không có dữ liệu' }}</p>
  <p><strong>Tên Sách:</strong> {{ sach.TenSach || 'Không có dữ liệu' }}</p>
  <p><strong>Nhà Xuất Bản:</strong> {{ sach.NguonGoc || 'Không có thông tin' }}</p>
  <p><strong>Năm Xuất Bản:</strong> {{ sach.NamXuatBan || 'Không có dữ liệu' }}</p>
</div>
        <p v-else-if="searched">Không tìm thấy sách.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const props = defineProps({ isOpen: Boolean });
  const emit = defineEmits(["close", "search"]);
  
  const maSach = ref("");
  const sach = ref(null);
  const searched = ref(false);
  
  const searchSach = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/sach/search?keyword=${maSach.value}`);
        if (!response.ok) throw new Error("Không tìm thấy sách");

        const data = await response.json();
        console.log("Kết quả tìm kiếm:", data); // Debug dữ liệu

        // Nếu API trả về một mảng, lấy phần tử đầu tiên (hoặc báo lỗi)
        sach.value = data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error("Lỗi khi tìm sách:", error);
        sach.value = null;
    } finally {
        searched.value = true;
    }
};

  </script>
  
  <style scoped>
  .popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4); /* Làm mờ nền */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
}

.popup-header {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
}

.popup-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.popup-body label {
  font-weight: 600;
  color: #444;
}

.popup-body input, 
.popup-body select {
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

.popup-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
  margin-right: 10px;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background: #495057;
}
  </style>
  