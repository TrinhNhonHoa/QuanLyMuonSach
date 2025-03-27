const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/QuanLyMuonSach";

// Middleware
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Kết nối MongoDB thành công"))
    .catch((error) => console.error("Lỗi kết nối MongoDB:", error));

// Routes
app.use("/api/sach", require("./routes/sachRoutes.js"));
app.use("/api/docgia", require("./routes/docgiaRoutes.js"));
app.use("/api/nhanvien", require("./routes/nhanvienRoutes.js"));
app.use("/api/nhaxuatban", require("./routes/nhaxuatbanRoutes.js"));
app.use("/api/muontra", require("./routes/muontraRoutes.js"));

// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
