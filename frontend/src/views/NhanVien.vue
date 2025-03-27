<template>
  <div class="container">
    <h1 class="title">Quản Lý Nhân Viên</h1>

    <!-- Đăng nhập -->
    <div v-if="!isLoggedIn" class="login-form">
      <h2>Đăng nhập</h2>
      <input v-model="loginData.MSNV" type="text" placeholder="Mã số nhân viên" required />
      <input v-model="loginData.password" type="password" placeholder="Mật khẩu" required />
      <button @click="login">Đăng nhập</button>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </div>

    <!-- Nếu đã đăng nhập -->
    <div v-else>
      <p>Chào, {{ currentUser.hotenNV }} ({{ currentUser.chucVu }})</p>
      <button @click="logout">Đăng xuất</button>

      <!-- Chỉ Quản Lý mới có quyền thêm nhân viên -->
      <div v-if="currentUser.chucVu === 'Quản Lý'" class="admin-actions">
        <h2>Thêm nhân viên</h2>
        <input v-model="registerData.MSNV" type="text" placeholder="Mã số nhân viên" required />
        <input v-model="registerData.hotenNV" type="text" placeholder="Họ tên nhân viên" required />
        <input v-model="registerData.password" type="password" placeholder="Mật khẩu" required />
        <select v-model="registerData.chucVu">
          <option value="Nhân Viên">Nhân Viên</option>
          <option value="Quản Lý">Quản Lý</option>
        </select>
        <input v-model="registerData.diaChi" type="text" placeholder="Địa chỉ" required />
        <input v-model="registerData.soDienThoai" type="text" placeholder="Số điện thoại" required />
        <button @click="register">Thêm nhân viên</button>
        <p v-if="registerError" class="error">{{ registerError }}</p>
      </div>

      <!-- Chỉ Quản Lý mới có quyền xem danh sách nhân viên -->
      <div v-if="currentUser.chucVu === 'Quản Lý'" class="admin-actions">
        <h2>Danh sách nhân viên</h2>
        <button @click="fetchNhanViens">Tải danh sách</button>
        
        <table class="table" v-if="nhanVienList.length">
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ Tên</th>
              <th>Chức Vụ</th>
              <th>Địa Chỉ</th>
              <th>Số Điện Thoại</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nhanVien in nhanVienList" :key="nhanVien.MSNV">
              <td>{{ nhanVien.MSNV }}</td>
              <td>{{ nhanVien.hotenNV }}</td>
              <td>{{ nhanVien.chucVu }}</td>
              <td>{{ nhanVien.diaChi }}</td>
              <td>{{ nhanVien.soDienThoai }}</td>
              <td>
                <button @click="openEditPopup(nhanVien)">Sửa</button>
                <button @click="deleteNhanVien(nhanVien._id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Chỉnh sửa thông tin cá nhân -->
      <div class="profile">
        <h2>Thông tin cá nhân</h2>
        <p><strong>Mã NV:</strong> {{ currentUser.MSNV }}</p>
        <p><strong>Họ tên:</strong> {{ currentUser.hotenNV }}</p>
        <p><strong>Chức vụ:</strong> {{ currentUser.chucVu }}</p>
        <p><strong>Địa chỉ:</strong> {{ currentUser.diaChi }}</p>
        <p><strong>Số điện thoại:</strong> {{ currentUser.soDienThoai }}</p>
        <button @click="openEditPopup(currentUser)">Chỉnh sửa</button>
      </div>
    </div>

    <!-- Popup Chỉnh sửa -->
    <div v-if="showEditPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>Chỉnh Sửa Nhân Viên</h2>
        <input v-model="editData.hotenNV" type="text" placeholder="Họ Tên" required />
        <input v-model="editData.diaChi" type="text" placeholder="Địa Chỉ" required />
        <input v-model="editData.soDienThoai" type="text" placeholder="Số Điện Thoại" required />
        <input v-model="editData.password" type="password" placeholder="Mật khẩu mới (nếu có)" />
        <button @click="updateNhanVien">Cập nhật</button>
        <button @click="showEditPopup = false" class="btn-cancel">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
      loginData: { MSNV: "", password: "" },
      registerData: { MSNV: "", hotenNV: "", password: "", chucVu: "Nhân Viên", diaChi: "", soDienThoai: "" },
      nhanVienList: [],
      showEditPopup: false,
      editData: {},
      loginError: "",
      registerError: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:5000/api/nhanvien/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.loginData),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        this.currentUser = data.nhanVien;
        this.isLoggedIn = true;
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      } catch (error) {
        this.loginError = error.message;
      }
    },
    logout() {
      this.isLoggedIn = false;
      this.currentUser = null;
      localStorage.removeItem("currentUser");
    },
    openEditPopup(nhanVien) {
      this.editData = { ...nhanVien };
      this.showEditPopup = true;
    },
    async updateNhanVien() {
      try {
        await fetch(`http://localhost:5000/api/nhanvien/${this.editData.MSNV}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.editData),
        });
        alert("Cập nhật thành công!");
        this.showEditPopup = false;
        this.fetchNhanViens();
      } catch (error) {
        console.error("Lỗi khi cập nhật nhân viên:", error);
      }
    },
    async fetchNhanViens() {
      try {
        const response = await fetch("http://localhost:5000/api/nhanvien/");
        this.nhanVienList = await response.json();
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
      }
    },
  },
  mounted() {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isLoggedIn = true;
    }
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 20px auto;
  text-align: center;
}
h1, h2 {
  color: #333;
}
input, select {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
button {
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 5px;
}
.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}
.table th, .table td {
  border: 1px solid #ddd;
  padding: 10px;
}

.btn-cancel {
  background: #dc3545; /* Màu đỏ */
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-cancel:hover {
  background: #b52b3a; /* Màu đỏ đậm hơn khi hover */
}

</style>
