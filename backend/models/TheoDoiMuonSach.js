const mongoose = require("mongoose");

const TheoDoiMuonSachSchema = new mongoose.Schema({
    MaDocGia: { type: String, required: true }, // Chuyển từ ObjectId sang String
    MaSach: { type: String, required: true },   // Chuyển từ ObjectId sang String
    NgayMuon: { type: Date, required: true, default: Date.now },
    NgayTra: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("TheoDoiMuonSach", TheoDoiMuonSachSchema);
