const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const authRoutes = require("./routes/auth");
const app = express();
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(cors());
app.use(express.json());


app.use("/api", authRoutes);



app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);