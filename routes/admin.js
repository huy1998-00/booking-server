const { Router } = require("express");
const express = require("express");

const router = express.Router();

const AdminController = require("../controllers/admin");

router.post("/admin/login", AdminController.AdminLogin);

router.get("/admin/user", AdminController.AdmingetUser);
router.get("/admin/hotel", AdminController.AdmingetHotel);

router.get("/admin/room", AdminController.AdmingetRoom);

router.get("/admin/trans", AdminController.AdmingetTran);

router.post("/admin/newhotel", AdminController.AdminpostHotel);

router.post("/admin/deletehotel", AdminController.AdmindeleteHototel);

router.post("/admin/newroom", AdminController.AdminpostRoom);
router.post("/admin/deleteroom", AdminController.AdmindeleteRoom);

router.post("/admin/edithotel", AdminController.AdminEditHotel);
router.post("/admin/editedhotel", AdminController.AdminpostEditedHotel);

router.post("/admin/editroom", AdminController.AdminEditRoom);
router.post("/admin/editedroom", AdminController.AdminpostEditedRoom);

module.exports = router;
