<template>
  <div id="app">
    <header>
      <h1>Quản Lý Mượn Sách</h1>
      <nav>
        <router-link to="/">Trang chủ</router-link>
        <router-link to="/sach">Sách</router-link>
        <router-link to="/muontra">Mượn Trả</router-link>
        <router-link to="/docgia">Độc Giả</router-link>
        <router-link to="/nhanvien">Nhân Viên</router-link>
        <router-link to="/nhaxuatban">Nhà Xuất Bản</router-link>
      </nav>
    </header>
    
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  color: #333;
}

header {
  background-color: #42b983;
  padding: 15px;
  color: white;
}

nav {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

</style>
