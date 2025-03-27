const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const NhanVien = require("../models/NhanVien");
const { verifyRole } = require("../middleware/authMiddleware");

// 📌 API Đăng ký nhân viên (Thêm nhân viên mới)
router.post("/register", verifyRole("Quản Lý"), async (req, res) => {
  try {
    const { MSNV, hotenNV, password, chucVu, diaChi, soDienThoai } = req.body;

    // 🔹 Kiểm tra nếu thiếu thông tin
    if (!MSNV || !hotenNV || !password || !chucVu || !diaChi || !soDienThoai) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // 🔹 Kiểm tra chức vụ hợp lệ
    if (!["Nhân Viên", "Quản Lý"].includes(chucVu)) {
      return res.status(400).json({ message: "Chức vụ không hợp lệ!" });
    }

    // 🔹 Kiểm tra nếu MSNV đã tồn tại
    const existingNhanVien = await NhanVien.findOne({ MSNV });
    if (existingNhanVien) {
      return res.status(400).json({ message: "Mã số nhân viên đã tồn tại!" });
    }

    // 🔹 Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Tạo nhân viên mới
    const newNhanVien = new NhanVien({
      MSNV,
      hotenNV,
      password: hashedPassword,
      chucVu,
      diaChi,
      soDienThoai
    });

    await newNhanVien.save();
    res.status(201).json({ message: "Thêm nhân viên thành công!", nhanVien: newNhanVien });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// 📌 API Đăng nhập nhân viên
router.post("/login", async (req, res) => {
  try {
    const { MSNV, password } = req.body;

    // 🔹 Kiểm tra xem nhân viên có tồn tại không
    const nhanVien = await NhanVien.findOne({ MSNV });
    if (!nhanVien) {
      return res.status(404).json({ message: "Nhân viên không tồn tại!" });
    }

    // 🔹 Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, nhanVien.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    // ✅ Trả về thông tin nhân viên
    res.json({
      message: "Đăng nhập thành công!",
      nhanVien: {
        MSNV: nhanVien.MSNV,
        hotenNV: nhanVien.hotenNV,
        chucVu: nhanVien.chucVu,
        diaChi: nhanVien.diaChi,
        soDienThoai: nhanVien.soDienThoai,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// 📌 API Lấy danh sách nhân viên (Chỉ "Quản Lý" mới có quyền)
router.get("/", verifyRole("Quản Lý"), async (req, res) => {
  try {
    const nhanVienList = await NhanVien.find().select("-password"); // Không gửi password
    res.json(nhanVienList);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// 📌 API Lấy thông tin cá nhân (Tất cả nhân viên có thể xem)
router.get("/me", async (req, res) => {
  try {
    const msnv = req.headers["msnv"] || req.headers["MSNV"];
    if (!msnv) return res.status(403).json({ message: "Vui lòng cung cấp MSNV!" });

    const nhanVien = await NhanVien.findOne({ MSNV: msnv }).select("-password");
    if (!nhanVien) return res.status(404).json({ message: "Nhân viên không tồn tại!" });

    res.json(nhanVien);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// 📌 API Xóa nhân viên (Chỉ "Quản Lý" mới có quyền)
router.delete("/:id", verifyRole("Quản Lý"), async (req, res) => {
  try {
    const nhanVien = await NhanVien.findByIdAndDelete(req.params.id);
    if (!nhanVien) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
    }
    res.json({ message: "Xóa nhân viên thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

// 📌 Cập nhật thông tin nhân viên
router.put("/:MSNV", async (req, res) => {
  try {
    const { hotenNV, chucVu, diaChi, soDienThoai, password } = req.body;
    const { MSNV } = req.params;

    // Tìm nhân viên theo MSNV
    let nhanVien = await NhanVien.findOne({ MSNV });
    if (!nhanVien) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên!" });
    }

    // Nếu có mật khẩu mới, mã hóa lại trước khi cập nhật
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      nhanVien.password = hashedPassword;
    }

    // Cập nhật thông tin nhân viên
    nhanVien.hotenNV = hotenNV || nhanVien.hotenNV;
    nhanVien.chucVu = chucVu || nhanVien.chucVu;
    nhanVien.diaChi = diaChi || nhanVien.diaChi;
    nhanVien.soDienThoai = soDienThoai || nhanVien.soDienThoai;

    // Lưu thay đổi
    await nhanVien.save();

    res.json({ message: "Cập nhật thông tin nhân viên thành công!", nhanVien });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
});

module.exports = router;
