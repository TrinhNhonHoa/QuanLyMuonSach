<template>
  <div class="container">
    <h1 class="title">Danh Sách Sách</h1>
    
    <!-- Các nút chức năng -->
    <button @click="showAddPopup = true" class="btn">Thêm Sách</button>
    <button @click="showSearchPopup = true" class="btn">Tìm Sách</button>

    <!-- Bảng danh sách sách -->
    <table class="table">
      <thead>
        <tr>
          <th>Mã Sách</th>
          <th>Tên Sách</th>
          <th>Đơn Giá</th>
          <th>Số Quyển</th>
          <th>Năm Xuất Bản</th>
          <th>Mã NXB</th>
          <th>Nguồn Gốc</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sach in sachList" :key="sach._id">
          <td>{{ sach.MaSach }}</td>
          <td>{{ sach.TenSach }}</td>
          <td>{{ sach.DonGia }}</td>
          <td>{{ sach.SoQuyen }}</td>
          <td>{{ sach.NamXuatBan }}</td>
          <td>{{ sach.MaNXB }}</td>
          <td>{{ sach.NguonGoc }}</td>
          <td>
            <button @click="editSach(sach)" class="btn-edit">Sửa</button>
            <button @click="deleteSach(sach._id)" class="btn-delete">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>  
    <p v-if="sachList.length === 0">Không có dữ liệu</p>
    
    <!-- Popups -->
    <AddSachPopup :isOpen="showAddPopup" @close="showAddPopup = false" @added="fetchSach" />
    <SearchSachPopup :isOpen="showSearchPopup" @close="showSearchPopup = false" @search="setSearchResult" />
    <EditSachPopup :isOpen="showEditPopup" :sach="selectedSach" @close="showEditPopup = false" @updated="fetchSach" />
  </div>
</template>

<script>
import AddSachPopup from "../components/AddSachPopup.vue";
import SearchSachPopup from "../components/SearchSachPopup.vue";
import EditSachPopup from "../components/EditSachPopup.vue";

export default {
  components: { AddSachPopup, SearchSachPopup, EditSachPopup },
  data() {
    return {
      sachList: [],
      showAddPopup: false,
      showSearchPopup: false,
      showEditPopup: false,
      selectedSach: null
    };
  },
  mounted() {
    this.fetchSach();
  },
  methods: {
    async fetchSach() {
      try {
        const response = await fetch("http://localhost:5000/api/sach");
        this.sachList = await response.json();
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách:", error);
      }
    },
    editSach(sach) {
      this.selectedSach = sach;
      this.showEditPopup = true;
    },
    async deleteSach(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa sách này?")) return;
      try {
        await fetch(`http://localhost:5000/api/sach/${id}`, { method: "DELETE" });
        this.fetchSach();
      } catch (error) {
        console.error("Lỗi khi xóa sách:", error);
      }
    },
    setSearchResult(result) {
      this.sachList = result;
    }
  }
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
.table tr:nth-child(even) {
  background: #f2f2f2;
}
.table tr:hover {
  background: #ddd;
}
</style>
