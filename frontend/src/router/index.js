import { createRouter, createWebHistory } from 'vue-router';
import Sach from '../views/Sach.vue';
import MuonTra from '../views/MuonTra.vue';
import DocGia from '../views/DocGia.vue';
import NhanVien from '../views/NhanVien.vue';
import NhaXuatBan from '../views/NhaXuatBan.vue';

const routes = [
  { path: '/', redirect: '/sach' }, // Trang chủ chuyển hướng đến danh sách sách
  { path: '/sach', component: Sach },
  { path: '/muontra', component: MuonTra },
  { path: '/docgia', component: DocGia },
  { path: '/nhanvien', component: NhanVien },
  { path: '/nhaxuatban', component: NhaXuatBan },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
