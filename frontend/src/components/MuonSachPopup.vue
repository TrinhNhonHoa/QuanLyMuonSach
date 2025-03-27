<template>
  <div v-if="isOpen" class="popup-overlay">
    <div class="popup-content">
      <h2>Mượn Sách</h2>
      <form @submit.prevent="submitMuon">
        <label>Mã Độc Giả:</label>
        <input v-model="muonSach.MaDocGia" type="text" required />

        <label>Mã Sách:</label>
        <input v-model="muonSach.MaSach" type="text" required />

        <label>Ngày Mượn:</label>
        <input v-model="muonSach.NgayMuon" type="date" required />

        <div class="button-group">
          <button type="submit" class="btn-primary">Mượn</button>
          <button type="button" class="btn-cancel" @click="$emit('close')">Hủy</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({ isOpen: Boolean });
const emit = defineEmits(["close", "added"]);

const muonSach = ref({ MaDocGia: "", MaSach: "", NgayMuon: "" });

// 🔹 Mượn sách
const submitMuon = async () => {
  try {
    await fetch("http://localhost:5000/api/muontra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(muonSach.value),
    });

    emit("added"); // Cập nhật danh sách
    emit("close"); // Đóng popup
  } catch (error) {
    console.error("Lỗi khi mượn sách:", error);
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
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-content {
  background: white;
  padding: 20px;
  width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
label {
  font-weight: bold;
  display: block;
  margin: 10px 0 5px;
}
input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.button-group {
  display: flex;
  justify-content: space-between;
}
.btn-primary {
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
.btn-primary:hover {
  background: #0056b3;
}
.btn-cancel {
  background: red;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
}
.btn-cancel:hover {
  background: darkred;
}
</style>
