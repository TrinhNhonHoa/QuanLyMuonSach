const mongoose = require("mongoose");

const NhanVienSchema = new mongoose.Schema({
    MSNV: { type: String, required: true, unique: true },  // 🔹 Đảm bảo MSNV là bắt buộc và duy nhất
    hotenNV: { type: String, required: true },
    password: { type: String, required: true },  // 🔹 Mật khẩu sẽ được mã hóa khi lưu
    chucVu: { type: String, required: true, enum: ["Nhân Viên", "Quản Lý"] }, // Chỉ có 2 giá trị hợp lệ
    diaChi: { type: String, required: true },
    soDienThoai: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("NhanVien", NhanVienSchema);
