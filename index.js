
const path = require('path')
const express = require("express")
require('dotenv').config()
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000
const authRoutes = require("./src/routes/auth");
// Page Home
app.get("/", (req, res) => {
    res.send('SERVER ON')
})

app.use("/api", authRoutes);

// Page Error
app.get("*", (req, res) => {
    res.send("Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<")
});

app.listen(port, () => {
  console.log(`Start server listen at http://localhost:${port}`)
});