<template>
  <div class="container">
    <h1 class="title">Quản Lý Nhà Xuất Bản</h1>

    <!-- Nút mở popup thêm mới -->
    <button @click="showAddPopup = true" class="btn">Thêm Nhà Xuất Bản</button>

    <!-- Bảng danh sách nhà xuất bản -->
    <table class="table">
      <thead>
        <tr>
          <th>Mã NXB</th>
          <th>Tên Nhà Xuất Bản</th>
          <th>Địa Chỉ</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="nxb in nhaXuatBanList" :key="nxb._id">
          <td>{{ nxb.MaNXB }}</td>
          <td v-if="!nxb.isEditing">{{ nxb.TenNXB }}</td>
          <td v-if="!nxb.isEditing">{{ nxb.DiaChi }}</td>

          <td v-if="nxb.isEditing">
            <input v-model="nxb.TenNXB" />
          </td>
          <td v-if="nxb.isEditing">
            <input v-model="nxb.DiaChi" />
          </td>

          <td>
            <button v-if="!nxb.isEditing" @click="editNXB(nxb)" class="btn-edit">Sửa</button>
            <button v-if="nxb.isEditing" @click="updateNXB(nxb)" class="btn-save">Lưu</button>
            <button v-if="nxb.isEditing" @click="cancelEdit(nxb)" class="btn-cancel">Hủy</button>
            <button @click="deleteNXB(nxb._id)" class="btn-delete">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="nhaXuatBanList.length === 0">Không có dữ liệu.</p>

    <!-- Sử dụng component thêm mới -->
    <AddNhaXuatBanPopup :isOpen="showAddPopup" @close="showAddPopup = false" @added="fetchNhaXuatBan" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import AddNhaXuatBanPopup from "../components/AddNhaXuatBanPopup.vue";

export default {
  components: { AddNhaXuatBanPopup },
  setup() {
    const nhaXuatBanList = ref([]);
    const showAddPopup = ref(false);

    // 🔹 Lấy danh sách nhà xuất bản
    const fetchNhaXuatBan = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/nhaxuatban");
        nhaXuatBanList.value = await response.json();
      } catch (error) {
        console.error("Lỗi khi lấy danh sách NXB:", error);
      }
    };

    // 🔹 Chỉnh sửa nhà xuất bản
    const editNXB = (nxb) => {
      nxb.isEditing = true;
    };

    // 🔹 Lưu cập nhật nhà xuất bản
    const updateNXB = async (nxb) => {
      try {
        await fetch(`http://localhost:5000/api/nhaxuatban/${nxb._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ TenNXB: nxb.TenNXB, DiaChi: nxb.DiaChi }),
        });

        nxb.isEditing = false;
        fetchNhaXuatBan();
      } catch (error) {
        console.error("Lỗi khi cập nhật nhà xuất bản:", error);
      }
    };

    // 🔹 Hủy chỉnh sửa
    const cancelEdit = (nxb) => {
      nxb.isEditing = false;
      fetchNhaXuatBan();
    };

    // 🔹 Xóa nhà xuất bản
    const deleteNXB = async (id) => {
      if (!confirm("Bạn có chắc chắn muốn xóa nhà xuất bản này?")) return;
      try {
        await fetch(`http://localhost:5000/api/nhaxuatban/${id}`, { method: "DELETE" });
        fetchNhaXuatBan();
      } catch (error) {
        console.error("Lỗi khi xóa nhà xuất bản:", error);
      }
    };

    onMounted(fetchNhaXuatBan);

    return { nhaXuatBanList, showAddPopup, fetchNhaXuatBan, editNXB, updateNXB, cancelEdit, deleteNXB };
  },
};
</script>
<style scoped>
.container {
  max-width: 900px;
  margin: 20px auto;
  text-align: center;
}
.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
.btn {
  margin: 10px;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.btn:hover {
  background: #0056b3;
}
.btn-edit {
  background: #ffc107;
  color: black;
  margin-right: 5px;
}
.btn-save {
  background: #28a745;
  color: white;
}
.btn-cancel {
  background: red;
  color: white;
}
.btn-delete {
  background: #dc3545;
  color: white;
}
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}
.table th, .table td {
  border: 1px solid #ddd;
  padding: 10px;
}
.table th {
  background: #007bff;
  color: white;
}
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
</style> 