const express = require("express");
const multer = require("multer");
const controller = require("../controllers/events.controller");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.get("/", controller.getEvents);
router.post("/", upload.single("image"), controller.createEvent);
router.put("/:id", upload.single("image"), controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;
