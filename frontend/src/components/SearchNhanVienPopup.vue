<template>
    <div v-if="isOpen" class="popup-overlay">
      <div class="popup-content">
        <h2>Tìm Kiếm Nhân Viên</h2>
        <form @submit.prevent="searchNhanVien">
          <label>MSNV:</label>
          <input v-model="msnv" type="text" required />
  
          <div class="button-group">
            <button type="submit" class="btn-primary">Tìm</button>
            <button type="button" class="btn-secondary" @click="$emit('close')">Hủy</button>
          </div>
        </form>
  
        <div v-if="searched">
          <h3>Kết Quả:</h3>
          <p v-if="nhanVien">
            <strong>Họ Tên:</strong> {{ nhanVien.HoTenNV }}<br>
            <strong>Chức Vụ:</strong> {{ nhanVien.ChucVu }}<br>
            <strong>Địa Chỉ:</strong> {{ nhanVien.DiaChi }}<br>
            <strong>Số Điện Thoại:</strong> {{ nhanVien.SoDienThoai }}
          </p>
          <p v-else>⚠ Không tìm thấy nhân viên!</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  defineProps({ isOpen: Boolean });
  const emit = defineEmits(["close", "search"]);
  
  const msnv = ref("");
  const nhanVien = ref(null);
  const searched = ref(false);
  
  const searchNhanVien = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/nhanvien/search?MSNV=${msnv.value}`);
      if (!response.ok) throw new Error("Không tìm thấy nhân viên");
  
      const data = await response.json();
      nhanVien.value = data;
    } catch (error) {
      console.error("Lỗi khi tìm nhân viên:", error);
      nhanVien.value = null;
    } finally {
      searched.value = true;
    }
  };
  </script>
  