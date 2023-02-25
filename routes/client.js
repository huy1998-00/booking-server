const express = require("express");

const router = express.Router();

const ClientControllers = require("../controllers/client");

router.post("/client/signup", ClientControllers.ClientSignUp);

router.post("/client/login", ClientControllers.ClientLogin);

router.get("/client/home", ClientControllers.ClientHome);
router.get("/client/top3", ClientControllers.ClientTop3);

router.post("/client/search", ClientControllers.ClientSeach);

router.get("/client/hotels/:id", ClientControllers.ClientHotelDetail);
router.post("/client/createtrans", ClientControllers.ClientCreateTrans);
router.get("/client/trans/:id", ClientControllers.ClientGetTrans);

module.exports = router;
