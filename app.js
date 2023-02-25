const express = require("express");
const cors = require("cors");
const app = express();

const mongoose = require("mongoose");

const ClientRoute = require("./routes/client");

const AdminRoute = require("./routes/admin");

app.use(cors());
app.use(express.json());
app.use(AdminRoute);

app.use(ClientRoute);
mongoose
  .connect(
    "mongodb+srv://dangquanghuy:dangquanghuy@bookingweb.c3br8pi.mongodb.net/booking?retryWrites=true&w=majority"
  )
  .then((result) => {
    console.log("Connected");
    app.listen(5000, function () {
      console.log("CORS-enabled web server listening on port 5000");
    });
  });
