<template>
    <nav>
      <ul>
        <li><router-link to="/">Trang chủ</router-link></li>
        <li><router-link to="/sach">Sách</router-link></li>
        <li><router-link to="/muontra">Mượn/Trả</router-link></li>
        <li><router-link to="/docgia">Độc giả</router-link></li>
        <li><router-link to="/nhanvien">Nhân viên</router-link></li>
        <li><router-link to="/nhaxuatban">Nhà xuất bản</router-link></li>
      </ul>
    </nav>
  </template>
  
  <style scoped>
  nav {
    background: #333;
    padding: 10px;
  }
  ul {
    list-style: none;
    display: flex;
  }
  li {
    margin-right: 15px;
  }
  a {
    color: white;
    text-decoration: none;
  }
  </style>
  