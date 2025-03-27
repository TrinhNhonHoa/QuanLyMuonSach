<template>
  <div class="container">
    <h1 class="title">Quản Lý Mượn Trả Sách</h1>

    <!-- Bảng hiển thị danh sách mượn trả -->
    <table class="table">
      <thead>
        <tr>
          <th>Mã Độc Giả</th>
          <th>Họ Tên Độc Giả</th>
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Ngày Mượn</th>
          <th>Ngày Trả</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in muonTraList" :key="record._id">
          <td>{{ record.MaDocGia }}</td>
          <td>{{ record.TenDocGia || "Không có dữ liệu" }}</td>
          <td>{{ record.MaSach }}</td>
          <td>{{ record.TenSach || "Không có dữ liệu" }}</td>
          <td>{{ record.NgayMuon ? new Date(record.NgayMuon).toLocaleDateString() : "Không có dữ liệu" }}</td>
          <td>{{ record.NgayTra ? new Date(record.NgayTra).toLocaleDateString() : "Chưa trả" }}</td>
          <td>
            <button class="btn btn-edit" @click="editRecord(record)">Sửa</button>
            <button class="btn btn-delete" @click="deleteRecord(record.MaDocGia, record.MaSach)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="muonTraList.length === 0">Không có dữ liệu</p>

    <!-- Form mượn sách -->
    <div class="form-container">
      <h2>{{ isEditing ? "Sửa Thông Tin Mượn Trả" : "Mượn Sách" }}</h2>
      <form @submit.prevent="isEditing ? updateRecord() : muonSach()">
        <input type="text" v-model="form.MaDocGia" placeholder="Mã Độc Giả" required />
        <input type="text" v-model="form.MaSach" placeholder="Mã Sách" required />
        <input type="date" v-model="form.NgayMuon" required />
        <input type="date" v-model="form.NgayTra" />
        <button class="btn btn-primary" type="submit">{{ isEditing ? "Cập Nhật" : "Mượn Sách" }}</button>
        <button class="btn btn-cancel" v-if="isEditing" @click="cancelEdit">Hủy</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const muonTraList = ref([]);
    const form = ref({ MaDocGia: "", MaSach: "", NgayMuon: "", NgayTra: "" });
    const isEditing = ref(false);

    const fetchMuonTra = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/muontra");
        if (!response.ok) throw new Error("Lỗi khi lấy dữ liệu mượn sách");
        const data = await response.json();
        muonTraList.value = data.map(item => ({
          ...item,
          TenDocGia: item.MaDocGia, // Không có object populate, nên dùng MaDocGia luôn
          TenSach: item.MaSach // Không có object populate, nên dùng MaSach luôn
        }));
      } catch (error) {
        console.error("Lỗi frontend:", error);
      }
    };

    const muonSach = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/muontra/muon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form.value),
        });
        if (!response.ok) throw new Error("Lỗi khi mượn sách");
        fetchMuonTra();
        form.value = { MaDocGia: "", MaSach: "", NgayMuon: "", NgayTra: "" };
      } catch (error) {
        console.error("Lỗi frontend:", error);
      }
    };

    const editRecord = (record) => {
      form.value = { ...record };
      isEditing.value = true;
    };

    const updateRecord = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/muontra/sua", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form.value),
        });
        if (!response.ok) throw new Error("Lỗi khi cập nhật");
        fetchMuonTra();
        form.value = { MaDocGia: "", MaSach: "", NgayMuon: "", NgayTra: "" };
        isEditing.value = false;
      } catch (error) {
        console.error("Lỗi frontend:", error);
      }
    };

    const deleteRecord = async (MaDocGia, MaSach) => {
      if (!confirm("Bạn có chắc chắn muốn xóa không?")) return;
      try {
        const response = await fetch("http://localhost:5000/api/muontra/xoa", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ MaDocGia, MaSach }),
        });
        if (!response.ok) throw new Error("Lỗi khi xóa");
        fetchMuonTra();
      } catch (error) {
        console.error("Lỗi frontend:", error);
      }
    };

    const cancelEdit = () => {
      form.value = { MaDocGia: "", MaSach: "", NgayMuon: "", NgayTra: "" };
      isEditing.value = false;
    };

    onMounted(fetchMuonTra);

    return { muonTraList, form, isEditing, muonSach, editRecord, updateRecord, deleteRecord, cancelEdit };
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 20px auto;
  text-align: center;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.table th, .table td {
  border: 1px solid #ddd;
  padding: 10px;
}
.table th {
  background: #007bff;
  color: white;
}
.btn {
  margin: 5px;
  padding: 8px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}
.btn-primary { background: #28a745; color: white; }
.btn-edit { background: orange; color: white; }
.btn-delete { background: crimson; color: white; }
.btn-cancel { background: red; color: white; }
.form-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  display: inline-block;
}
input {
  display: block;
  width: 100%;
  padding: 8px;
  margin: 10px 0;
  border: 1px solid #ddd;
}
</style>
