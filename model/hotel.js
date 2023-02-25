const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: String,
      required: true,
    },
  ],
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: false,
    },
  ],
});

module.exports = mongoose.model("Hotel", hotelSchema);
