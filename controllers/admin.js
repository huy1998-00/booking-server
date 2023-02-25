const User = require("../model/user");
const Hotel = require("../model/hotel");
const Room = require("../model/room");
const Transaction = require("../model/transaction");
const mongoose = require("mongoose");
const hotel = require("../model/hotel");

exports.AdminLogin = (req, res, next) => {
  const reqEmail = req.body.email;
  const reqPass = req.body.password;
  User.findOne({ email: reqEmail })
    .then((user) => {
      if (!user) {
        return res.status(400).send("khong tim thay email");
      }
      if (user.password !== reqPass) {
        return res.status(400).send("Sai Mat khau");
      }
      if (user.isAdmin === false) {
        return res.status(400).send("Khong Phai Admin");
      }

      return res.status(200).send("Dang nhap thanh cong");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AdmingetUser = (req, res, next) => {
  User.find().then((results) => {
    return res.json(results);
  });
};
exports.AdmingetHotel = (req, res, next) => {
  Hotel.find().then((results) => {
    return res.json(results);
  });
};
exports.AdmingetRoom = (req, res, next) => {
  Room.find().then((results) => {
    return res.json(results);
  });
};
exports.AdmingetTran = (req, res, next) => {
  Transaction.find()
    .populate("user hotel")
    .then((results) => {
      results.sort(function (a, b) {
        var aa = a.dateStart.split("/").reverse().join(),
          bb = b.dateStart.split("/").reverse().join();
        return aa < bb ? -1 : aa > bb ? 1 : 0;
      });
      console.log(results);

      return res.json(results);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AdminpostHotel = (req, res, next) => {
  const name = req.body.name;
  const type = req.body.type;
  const city = req.body.city;
  const title = req.body.title;
  const description = req.body.description;
  const photos = req.body.images.split(",");
  const featured = req.body.featured;
  const distance = req.body.distance;
  const address = req.body.address;

  const NewHotel = new Hotel({
    name: name,
    title: title,
    city: city,
    desc: description,
    type: type,
    photos: photos,
    distance: distance,
    featured: featured,
    address: address,
  });
  NewHotel.save();

  return res.status(200);
};

exports.AdmindeleteHototel = (req, res, next) => {
  const id = req.body.id;
  console.log(id);

  Transaction.find({ hotel: id }).then((trans) => {
    if (trans.length > 0) {
      return res
        .status(403)
        .send("Khach san nhay da co lich dat vui long kiem tra lai");
    } else {
      return Hotel.findByIdAndRemove(id)
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.AdminpostRoom = (req, res, next) => {
  const body = req.body;
  const rooms = body.room.split(",").map(Number);
  const title = body.title;
  const hID = body.hotel;

  Room.find({ title: title })
    .then((room) => {
      if (room.length > 0) {
        return res.status(403).send("Ten phong da ton tai");
      } else {
        const newRoom = new Room({
          desc: body.description,
          maxPeople: parseInt(body.max),
          price: parseInt(body.price),
          title: body.title,
          roomNumbers: rooms,
          hotelId: body.hotel,
        });
        return newRoom.save();
      }
    })
    .then((result) => {
      if (result) {
        Hotel.findById(hID).then((hotel) => {
          hotel.rooms.push(result._id);
          return hotel.save();
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AdmindeleteRoom = (req, res, next) => {
  const rId = req.body.id;

  Room.findById(rId)
    .then((room) => {
      if (room.bookedNumbers.length > 0) {
        return res
          .status(400)
          .send("Phong nay da co lich dat, vui long kiem tra lai");
      } else {
        Room.findByIdAndDelete(rId).then((result) => {
          if (result) {
            Hotel.findOneAndUpdate(
              { rooms: rId },
              { $pull: { rooms: rId } },
              function (err, data) {
                console.log(err, data);
              }
            );
          }

          return res.status(200).send("deleted");
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AdminEditHotel = (req, res, next) => {
  const { id } = req.body.id;
  console.log(id);
  Hotel.findById(id).then((hotel) => {
    res.json(hotel);
  });
};

exports.AdminpostEditedHotel = (req, res, next) => {
  const { id } = req.body.id;
  const updatedinfo = req.body;

  Hotel.findById(id)
    .then((hotel) => {
      hotel.name = updatedinfo.name;
      hotel.type = updatedinfo.type;
      hotel.address = updatedinfo.address;
      hotel.city = updatedinfo.city;
      hotel.photos = updatedinfo.images;
      hotel.desc = updatedinfo.description;
      hotel.distance = updatedinfo.distance;
      hotel.title = updatedinfo.title;
      hotel.price = updatedinfo.price;

      return hotel.save();
    })
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.AdminEditRoom = (req, res, next) => {
  const { id } = req.body.id;
  console.log(id);
  Room.findById(id).then((room) => {
    res.json(room);
  });
};

exports.AdminpostEditedRoom = (req, res, next) => {
  const { id } = req.body.id;
  const updatedinfo = req.body;

  Room.findById(id)
    .then((room) => {
      room.title = updatedinfo.title;
      room.desc = updatedinfo.description;
      room.price = updatedinfo.price;
      room.maxPeople = updatedinfo.max;
      room.roomNumbers = updatedinfo.room.split(",").map(Number);
      return room.save();
    })
    .then((result) => {})
    .catch((err) => {
      console.log(err);
    });
};
