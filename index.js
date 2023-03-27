const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const authRoutes = require("./routes/auth");
const app = express();
require("dotenv").config();



app.use(cors());
app.use(express.json());
// Page Home
app.get("/", (req, res) => {
  res.send('SERVER ON')
})
app.use("/api", authRoutes);

app.get("*", (req, res) => {
  res.send("Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<")
});


app.listen(5000, () =>
  console.log(`Server started on`)
);