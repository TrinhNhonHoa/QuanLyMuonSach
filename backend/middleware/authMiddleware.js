const NhanVien = require("../models/NhanVien");

// Middleware kiểm tra quyền theo chức vụ
const verifyRole = (role) => {
  return async (req, res, next) => {
    try {
      const msnv = req.headers["msnv"] || req.headers["MSNV"]; // 🔥 Lấy đúng MSNV từ headers
      if (!msnv) return res.status(403).json({ message: "Vui lòng cung cấp MSNV!" });

      // 🔹 Tìm nhân viên theo MSNV
      const nhanVien = await NhanVien.findOne({ MSNV: msnv });
      if (!nhanVien) return res.status(404).json({ message: "Nhân viên không tồn tại!" });

      // 🔹 Kiểm tra chức vụ
      if (nhanVien.chucVu !== role) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập!" });
      }

      req.nhanVien = nhanVien; // Gán nhân viên vào request để sử dụng sau
      next();
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  };
};

module.exports = { verifyRole };
