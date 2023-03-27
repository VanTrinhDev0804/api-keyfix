// const express = require("express");
// const cors = require("cors");
// const bodyParser = require('body-parser')
// const authRoutes = require("./routes/auth");
// const app = express();
// require("dotenv").config();



// app.use(cors());
// app.use(express.json());
// // Page Home
// app.get("/", (req, res) => {
//   res.send('SERVER ON')
// })
// app.use("/api", authRoutes);

// app.get("*", (req, res) => {
//   res.send("Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<")
// });


// app.listen(5000, () =>
//   console.log(`Server started on`)
// );

const path = require('path')
const express = require("express")
require('dotenv').config()
const app = express()
const cors = require("cors")
const port = process.env.PORT || 5000

// Page Home
app.get("/", (req, res) => {
    res.send('SERVER ON')
})


// Page Error
app.get("*", (req, res) => {
    res.send("Nhập Sai Đường Dẫn! Vui Lòng Nhập Lại >.<")
});

app.listen(port, () => {
  console.log(`Start server listen at http://localhost:${port}`)
});