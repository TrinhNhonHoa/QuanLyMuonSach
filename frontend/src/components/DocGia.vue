<template>
  <div class="container">
    <h1 class="title">Quản Lý Độc Giả</h1>

    <!-- Thanh công cụ -->
    <div class="toolbar">
      <button class="btn btn-add" @click="showAddPopup = true">Thêm Độc Giả</button>
      <button class="btn btn-search" @click="showSearchPopup = true">Tìm Độc Giả</button>
    </div>

    <!-- Bảng hiển thị danh sách độc giả -->
    <table class="table">
      <thead>
        <tr>
          <th>Mã Độc Giả</th>
          <th>Họ Lót</th>
          <th>Tên</th>
          <th>Ngày Sinh</th>
          <th>Phái</th>
          <th>Địa Chỉ</th>
          <th>Điện Thoại</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="docGia in docGiaList" :key="docGia._id">
          <td>{{ docGia.MaDocGia }}</td>
          <td>{{ docGia.HoLot }}</td>
          <td>{{ docGia.Ten }}</td>
          <td>{{ formatDate(docGia.NgaySinh) }}</td>
          <td>{{ docGia.Phai }}</td>
          <td>{{ docGia.DiaChi }}</td>
          <td>{{ docGia.DienThoai }}</td>
          <td>
            <button class="btn btn-edit" @click="editDocGia(docGia)">Sửa</button>
            <button class="btn btn-delete" @click="deleteDocGia(docGia._id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Popup Thêm Độc Giả -->
    <AddDocGiaPopup v-if="showAddPopup" @close="showAddPopup = false" @added="fetchDocGia" />

    <!-- Popup Tìm Độc Giả -->
    <SearchDocGiaPopup v-if="showSearchPopup" @close="showSearchPopup = false" @search="handleSearchResult" />

    <!-- Popup Chỉnh Sửa Độc Giả -->
    <EditDocGiaPopup v-if="showEditPopup" :docGia="selectedDocGia" @close="showEditPopup = false" @updated="fetchDocGia" />
  </div>
</template>

<script>
import AddDocGiaPopup from "./AddDocGiaPopup.vue";
import SearchDocGiaPopup from "./SearchDocGiaPopup.vue";
import EditDocGiaPopup from "./EditDocGiaPopup.vue";

export default {
  components: {
    AddDocGiaPopup,
    SearchDocGiaPopup,
    EditDocGiaPopup,
  },
  data() {
    return {
      docGiaList: [],
      showAddPopup: false,
      showSearchPopup: false,
      showEditPopup: false,
      selectedDocGia: null,
    };
  },
  mounted() {
    this.fetchDocGia();
  },
  methods: {
    async fetchDocGia() {
      try {
        const response = await fetch("http://localhost:5000/api/docgia");
        this.docGiaList = await response.json();
      } catch (error) {
        console.error("Lỗi khi tải danh sách độc giả:", error);
      }
    },
    async deleteDocGia(id) {
      if (confirm("Bạn có chắc muốn xóa độc giả này?")) {
        try {
          await fetch(`http://localhost:5000/api/docgia/${id}`, { method: "DELETE" });
          this.fetchDocGia();
        } catch (error) {
          console.error("Lỗi khi xóa độc giả:", error);
        }
      }
    },
    editDocGia(docGia) {
      this.selectedDocGia = { ...docGia };
      this.showEditPopup = true;
    },
    handleSearchResult(result) {
      this.docGiaList = result;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 20px auto;
  text-align: center;
}
.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-add {
  background: green;
  color: white;
}
.btn-search {
  background: blue;
  color: white;
}
.btn-edit {
  background: orange;
  color: white;
}
.btn-delete {
  background: red;
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
  text-transform: uppercase;
}
.table tr:nth-child(even) {
  background: #f2f2f2;
}
.table tr:hover {
  background: #ddd;
}
</style>
