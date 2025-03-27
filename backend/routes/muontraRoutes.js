const express = require("express");
const router = express.Router();
const TheoDoiMuonSach = require("../models/TheoDoiMuonSach");

// Lấy danh sách mượn trả
router.get("/", async (req, res) => {
  try {
    const records = await TheoDoiMuonSach.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách mượn trả", error });
  }
});

// Mượn sách
router.post("/muon", async (req, res) => {
  const { MaDocGia, MaSach, NgayMuon, NgayTra } = req.body;
  try {
    const newRecord = new TheoDoiMuonSach({ MaDocGia, MaSach, NgayMuon, NgayTra });
    await newRecord.save();
    res.status(201).json({ message: "Mượn sách thành công", record: newRecord });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi mượn sách", error });
  }
});

// Sửa thông tin mượn trả
router.put("/sua", async (req, res) => {
  const { MaDocGia, MaSach, NgayMuon, NgayTra } = req.body;
  try {
    const record = await TheoDoiMuonSach.findOneAndUpdate(
      { MaDocGia, MaSach },
      { NgayMuon, NgayTra },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: "Không tìm thấy thông tin mượn trả" });
    res.json({ message: "Cập nhật thành công", record });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error });
  }
});

// Xóa thông tin mượn trả
router.delete("/xoa", async (req, res) => {
  const { MaDocGia, MaSach } = req.body;
  try {
    const record = await TheoDoiMuonSach.findOneAndDelete({ MaDocGia, MaSach });
    if (!record) return res.status(404).json({ message: "Không tìm thấy thông tin mượn trả" });
    res.json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa", error });
  }
});

module.exports = router;
