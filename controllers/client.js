const User = require("../model/user");
const Hotel = require("../model/hotel");
const Room = require("../model/room");
const Transaction = require("../model/transaction");

const { query } = require("express");

const mongoose = require("mongoose");

const Objectid = mongoose.Schema.Types.ObjectId;

// const ObjectId =

exports.ClientSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = email.split("@")[0];

  console.log(email, password, username);

  User.find({ email: email })
    .then((user) => {
      // console.log(user);
      if (user.length <= 0) {
        const newUser = new User({
          username: username,
          password: password,
          email: email,
          isAdmin: false,
        });
        res.status(200).send("dang ki thanh cong");
        return newUser.save();
      } else {
        return res.status(409).send("email da ton tai");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.ClientLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const username = email.split("@")[0];

  console.log(email, password, username);

  User.find({ email: email })
    .then((user) => {
      console.log(user);
      if (user.length <= 0) {
        return res
          .status(409)
          .send("Khong tim thay email, vui long kiem tra lai");
      }
      if (user[0].password !== password) {
        return res.status(409).send("Mat khau khong dung");
      }

      return res.json(user).send("dang nhap thanh cong");
    })
    .catch((err) => {
      // console.log(err);
    });
};

exports.ClientHome = (req, res, next) => {
  Hotel.find().then((result) => {
    res.json(result);
  });
};

exports.ClientTop3 = (req, res, next) => {
  Hotel.find().then((hotels) => {
    hotels.sort(function (a, b) {
      return b.rating - a.rating;
    });
    res.json(hotels);
  });
};

exports.ClientSeach = (req, res, next) => {
  console.log(req.body.searchData);

  const destination = req.body.searchData.destination;
  const startDate = req.body.searchData.date.startDate;
  const endDate = req.body.searchData.date.endDate;
  const totalpeole =
    parseInt(req.body.searchData.options.adult) +
    parseInt(req.body.searchData.options.children);

  const room = parseInt(req.body.searchData.options.room);
  const maxpeopleperroom = totalpeole / room;

  Hotel.find({ city: destination })
    .populate("rooms")

    .then((hotel) => {
      if (hotel.length <= 0) {
        return res.status(404).send("not found any hotel");
      }
      let hotelList = [];

      if (hotel.length >= 1) {
        hotelList = hotel;
      }
      const result = hotelList.filter((h) => {
        return h.rooms.length >= room;
      });

      if (result.length > 0) {
        console.log(result);
        return res.json(result);
      } else {
        return res.status(404).send("not found any hotel");
      }
    });
};

exports.ClientHotelDetail = (req, res, next) => {
  const hotelId = req.params.id;
  console.log(hotelId);
  Hotel.findById(hotelId)
    .populate("rooms")
    .then((hotel) => {
      const result = hotel;
      return result;
    })
    .then((hotel) => {
      res.json(hotel);
    });
};

exports.ClientCreateTrans = (req, res, next) => {
  const data = req.body;
  const hId = data.hotel;
  const rooms = data.room;

  const updateUser = req.body.user;

  const UpdatedId = updateUser._id;

  User.findById(UpdatedId)
    .then((user) => {
      // console.log(user);
      const result = user;
      return result;
    })
    .then((result) => {
      result.phoneNumber = updateUser.phoneNumber;
      result.fullName = updateUser.fullName;
      result.email = updateUser.email;
      result.identityCard = updateUser.card;
      return result.save();
    })
    .catch((err) => {});

  Room.find({ hotelId: hId, roomNumbers: { $all: rooms } })
    .then((room) => {
      const result = room[0];
      console.log(result);

      // const updateRoomsNumber = result.roomNumbers.filter((value) => {
      //   return rooms.find((a) => {
      //     return value !== a;
      //   });
      // });
      // result.roomNumbers = updateRoomsNumber;

      result.bookedNumbers = rooms;

      return result.save();
    })
    .then((rs) => {
      const Trans = new Transaction({
        user: updateUser._id,
        hotel: data.hotel,
        room: data.room,
        dateStart: data.dateStart,
        dateEnd: data.dateEnd,
        price: data.price,
        payment: data.payment,
        status: "Booked",
      });
      return Trans.save();
    })
    .then((rs) => {
      res.status(200).send("created");
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.ClientGetTrans = (req, res, next) => {
  const clientId = req.params.id;
  console.log(clientId);
  Transaction.find({ user: clientId })
    .populate("hotel")
    .then((trans) => {
      res.json(trans);
    })
    .catch((err) => {
      console.log(err);
    });
};
